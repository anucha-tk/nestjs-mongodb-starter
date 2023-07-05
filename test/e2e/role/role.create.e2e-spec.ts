import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "src/common/auth/constants/auth.status-code.constant";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { RoleCreateDto } from "src/modules/role/dtos/role.create.dto";
import { RoleDoc } from "src/modules/role/repository/entities/role.entity";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "../helper/apiKey";
import { createRoleAdmin, createRoleUser } from "../helper/role";
import { createAdmin, createUser, mockPassword } from "../helper/user";

describe("role create e2e", () => {
  const CREATE_URL = "/admin/role/create";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let user: UserDoc;
  let admin: UserDoc;
  let userAccessToken: string;
  let adminAccessToken: string;
  let xApiKey: string;
  let roleUserDoc: RoleDoc;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = app.get(UserService);
    roleService = app.get(RoleService);
    await app.init();

    // create userRole
    const [roleUser, roleAdmin] = await Promise.all([
      createRoleUser(app, "user"),
      createRoleAdmin(app, "admin"),
    ]);
    roleUserDoc = roleUser;

    // create user
    const [adminRes, userRes, apiKeyRes] = await Promise.all([
      createAdmin({ app, roleId: roleAdmin._id }),
      createUser({ app, roleId: roleUser._id }),
      createApiKey(app),
    ]);
    admin = adminRes;
    user = userRes;
    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;

    // login by user
    const responses = await Promise.all([
      request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .send({ email: admin.email, password: mockPassword }),
      request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .send({ email: user.email, password: mockPassword }),
    ]);

    // get accessToken
    adminAccessToken = responses[0].body.data.accessToken;
    userAccessToken = responses[1].body.data.accessToken;
  });

  afterAll(async () => {
    await userService.deleteMany({});
    await roleService.deleteMany({});
    jest.clearAllMocks();
    await app.close();
  });

  describe(`POST ${CREATE_URL}`, () => {
    it("should return 401 when not add x-api-key", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`${CREATE_URL}`)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
    });
    it("should return 401 when not auth", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`${CREATE_URL}`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
    });
    it("should return 403 when not role admin or superAdmin", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`${CREATE_URL}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR);
    });
    it("should return 422 when empty body", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`${CREATE_URL}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(422);
      expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
    });
    it("should return 400 when role exist", async () => {
      const roleCreateDto: RoleCreateDto = {
        name: roleUserDoc.name,
        type: ENUM_ROLE_TYPE.USER,
        permissions: [],
      };
      const { body, status } = await request(app.getHttpServer())
        .post(`${CREATE_URL}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(roleCreateDto);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR);
    });
    it("should return 201 when create role successful", async () => {
      const roleCreateDto: RoleCreateDto = {
        name: faker.word.words(),
        description: faker.lorem.sentence(),
        type: ENUM_ROLE_TYPE.USER,
        permissions: [],
      };
      const { body, status } = await request(app.getHttpServer())
        .post(`${CREATE_URL}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(roleCreateDto);

      expect(status).toBe(201);
      expect(body.statusCode).toBeDefined();
      expect(body.data._id).toBeDefined();
    });
  });
});
