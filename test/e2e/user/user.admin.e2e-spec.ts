import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "../helper/apiKey";
import { createRoleAdmin, createRoleUser } from "../helper/role";
import { createAdmin, createUser, mockPassword } from "../helper/user";

describe("user admin e2e", () => {
  const BASE_URL = "/admin/user";
  const USER_BLOCKED_URL = `${BASE_URL}/update/:user/blocked`;
  const USER_ACTIVE_URL = `${BASE_URL}/update/:user/active`;
  const USER_INACTIVE_URL = `${BASE_URL}/update/:user/inactive`;
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let user: UserDoc;
  let admin: UserDoc;
  let xApiKey: string;
  let userAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = modRef.get<UserService>(UserService);
    roleService = modRef.get<RoleService>(RoleService);
    apiKeyService = modRef.get<ApiKeyService>(ApiKeyService);
    await app.init();

    // create userRole
    const [apiKeyRes, roleUser, roleAdmin] = await Promise.all([
      createApiKey(app),
      createRoleUser(app, "user"),
      createRoleAdmin(app, "admin"),
    ]);
    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;

    // create user
    user = await createUser({ app, roleId: roleUser._id });
    admin = await createAdmin({ app, roleId: roleAdmin._id });

    // login by user
    const [adminRes, userRes] = await Promise.all([
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: admin.email, password: mockPassword })
        .set("x-api-key", xApiKey),
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: user.email, password: mockPassword })
        .set("x-api-key", xApiKey),
    ]);

    // get accessToken
    adminAccessToken = adminRes.body.data.accessToken;
    userAccessToken = userRes.body.data.accessToken;
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
    await app.close();
  });

  describe(`Patch ${USER_INACTIVE_URL}`, () => {
    it("should return 200 when update inActive user successful", async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${user._id}/inactive`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body.message).toMatch(/inactive/i);
    });
  });

  describe(`Patch ${USER_ACTIVE_URL}`, () => {
    it("should return 200 when update active user successful", async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${user._id}/active`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body.message).toMatch(/active/i);
    });
  });

  describe(`Patch ${USER_BLOCKED_URL}`, () => {
    it("should return 401 when not x-api-key", async () => {
      const userId = faker.string.uuid();
      const { body, status } = await request(app.getHttpServer()).patch(
        `${BASE_URL}/update/${userId}/blocked`,
      );

      expect(status).toBe(401);
      expect(body.message).toMatch(/api key is missing/i);
    });
    it("should return 401 when not auth", async () => {
      const userId = faker.string.uuid();
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${userId}/blocked`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(401);
      expect(body.message).toMatch(/Access Token UnAuthorized/i);
    });
    it("should return 403 when not admin or superAdmin", async () => {
      const userId = faker.string.uuid();
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${userId}/blocked`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.message).toMatch(/role type not allowed/i);
    });
    it("should return 400 when user param not uuid", async () => {
      const userId = faker.word.words();
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${userId}/blocked`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body.message).toMatch(/bad request/i);
    });
    it("should return 404 when __user not found", async () => {
      const userId = faker.string.uuid();
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${userId}/blocked`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.message).toMatch(/user not found/i);
    });
    it("should return 401 when userOurSelf", async () => {
      const userId = admin._id;
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${userId}/blocked`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.message).toMatch(/user not found/i);
    });
    it("should return 200 when successful blocked user", async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${user._id}/blocked`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body.message).toMatch(/success blocked user/i);
    });
    it("should return 400 when user is false blocked", async () => {
      // NOTE: throw 400 because before test just user.blocked successful
      const { body, status } = await request(app.getHttpServer())
        .patch(`${BASE_URL}/update/${user._id}/blocked`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body.message).toMatch(/User blocked/i);
    });
  });
});
