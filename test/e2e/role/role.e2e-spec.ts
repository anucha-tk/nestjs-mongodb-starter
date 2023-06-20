import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ResponsePagingSerialization } from "src/common/response/serializations/response.paging.serialization";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createRoleAdmin, createRoleSuperAdmin, createRoleUser } from "../helper/role";
import { createAdmin, createUser, mockPassword } from "../helper/user";

describe("role e2e", () => {
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let user: UserDoc;
  let admin: UserDoc;
  let superAdmin: UserDoc;
  let userAccessToken: string;
  let adminAccessToken: string;
  let superAdminAccessToken: string;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = app.get(UserService);
    roleService = app.get(RoleService);
    await app.init();

    // create userRole
    const [roleUser, roleAdmin, roleSuperAdmin] = await Promise.all([
      createRoleUser(app, "user"),
      createRoleAdmin(app, "admin"),
      createRoleSuperAdmin(app, "superAdmin"),
    ]);

    // create user
    const users = await Promise.all([
      createAdmin({ app, roleId: roleAdmin._id }),
      createAdmin({ app, roleId: roleSuperAdmin._id }),
      createUser({ app, roleId: roleUser._id }),
    ]);
    admin = users[0];
    superAdmin = users[1];
    user = users[2];

    // login by user
    const responses = await Promise.all([
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: admin.email, password: mockPassword }),
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: superAdmin.email, password: mockPassword }),
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: user.email, password: mockPassword }),
    ]);

    // get accessToken
    adminAccessToken = responses[0].body.data.accessToken;
    superAdminAccessToken = responses[1].body.data.accessToken;
    userAccessToken = responses[2].body.data.accessToken;
  });

  afterAll(async () => {
    await userService.deleteMany({});
    await roleService.deleteMany({});
    jest.clearAllMocks();
    await app.close();
  });

  describe("role list", () => {
    it("should return 401 when not Authorization", async () => {
      const { body, status } = await request(app.getHttpServer()).get("/admin/role/list");

      expect(status).toBe(401);
      expect(body.message).toMatch(/Access Token UnAuthorized/i);
    });

    it("should return 403 when not policy not allow User", async () => {
      const { body, status } = await request(app.getHttpServer())
        .get("/admin/role/list")
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.message).toMatch(/role type not allowed/i);
    });

    it("should return pagination response with admin", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/role/list")
        .set("Authorization", `Bearer ${adminAccessToken}`);
      const body: ResponsePagingSerialization = response.body;

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(200);
      expect(body.message).toMatch(/Role list/i);
      expect(body._metadata).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body._metadata.pagination.page).toBeDefined();
      expect(body._metadata.pagination.orderBy).toBeDefined();
      expect(body._metadata.pagination.search).toBeDefined();
    });

    it("should return pagination response with superAdmin", async () => {
      const response = await request(app.getHttpServer())
        .get("/admin/role/list")
        .set("Authorization", `Bearer ${superAdminAccessToken}`);
      const body: ResponsePagingSerialization = response.body;

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(200);
      expect(body.message).toMatch(/Role list/i);
      expect(body._metadata).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body._metadata.pagination.page).toBeDefined();
      expect(body._metadata.pagination.orderBy).toBeDefined();
      expect(body._metadata.pagination.search).toBeDefined();
    });
  });
});
