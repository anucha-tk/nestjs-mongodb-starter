import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "src/common/auth/constants/auth.status-code.constant";
import { AuthService } from "src/common/auth/services/auth.service";
import { ENUM_POLICY_STATUS_CODE_ERROR } from "src/common/policy/constants/policy.status-code.constant";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { RoleService } from "src/modules/role/services/role.service";
import { ENUM_USER_STATUS_CODE_ERROR } from "src/modules/user/constants/user.status-code.constant";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { ApiKeyFaker } from "test/e2e/helper/api-key.faker";
import { AuthFaker } from "test/e2e/helper/auth.faker";
import { UserFaker } from "test/e2e/helper/user.faker";

describe("user soft-delete e2e", () => {
  const USER_SOFT_DELETE_URL = "/admin/user/soft-delete";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let xApiKey: string;
  let userAccessToken: string;
  let adminAccessToken: string;
  let adminUnPolicyAccessToken: string;
  let user: UserDoc;
  let userDelete: UserDoc;
  let admin: UserDoc;
  let superAdmin: UserDoc;
  let superAdminAccessToken: string;
  let password: string;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = modRef.get<UserService>(UserService);
    roleService = modRef.get<RoleService>(RoleService);
    apiKeyService = modRef.get<ApiKeyService>(ApiKeyService);
    const authService = modRef.get(AuthService);
    await app.init();

    const userFaker = new UserFaker(authService, userService, roleService);
    const apiKeyFaker = new ApiKeyFaker(apiKeyService);
    const authFaker = new AuthFaker(app);

    const apiKey = await apiKeyFaker.createApiKey({});
    xApiKey = apiKeyFaker.getXApiKey(apiKey);
    password = await userFaker.getPassword();

    // create user
    admin = await userFaker.createAdmin({});
    const adminUnPolicy = await userFaker.createAdmin({ permissions: [] });
    superAdmin = await userFaker.createSuperAdmin({});
    user = await userFaker.createUser({});
    userDelete = await userFaker.createUser({ deleted: true });

    // login by user
    const loginResponse = await Promise.all([
      authFaker.login({ email: admin.email, xApiKey }),
      authFaker.login({ email: adminUnPolicy.email, xApiKey }),
      authFaker.login({ email: user.email, xApiKey }),
      authFaker.login({ email: superAdmin.email, xApiKey }),
    ]);

    // get accessToken
    adminAccessToken = loginResponse[0];
    adminUnPolicyAccessToken = loginResponse[1];
    userAccessToken = loginResponse[2];
    superAdminAccessToken = loginResponse[3];
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
    await app.close();
  });

  describe("x-api-key", () => {
    it("should return 401 when not send x-api-key", async () => {
      const { status, body } = await request(app.getHttpServer()).delete(
        `${USER_SOFT_DELETE_URL}/${faker.string.uuid()}`,
      );

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
    });
  });
  describe("auth", () => {
    it("should return 401 when not auth", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
    });
    it("should return 403 when not admin or superAdmin", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR);
    });
    it("should return 403 when not admin not have user policy", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminUnPolicyAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_POLICY_STATUS_CODE_ERROR.POLICY_ABILITY_FORBIDDEN_ERROR);
    });
  });
  describe("guard", () => {
    it("should return 400 when user not uuid", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/123`)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
    });
    it("should return 404 when user not found", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR);
    });
    it("should return 404 when delete your self", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/${admin._id}`)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR);
    });
    it("should return 404 when user has deleted", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/${userDelete._id}`)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR);
    });
  });
  describe("softDelete response", () => {
    it("should return 200 when softDelete admin user", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${USER_SOFT_DELETE_URL}/${admin._id}`)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${superAdminAccessToken}`);

      expect(status).toBe(200);
      expect(body.data).toEqual({
        _id: admin._id,
      });
    });
    // NOTE:make behind test after softDelete success
    it("should return 404 when login after softDelete admin user", async () => {
      const { status, body } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .send({ email: admin.email, password });

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR);
    });
  });
});
