import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { AuthService } from "src/common/auth/services/auth.service";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { ApiKeyFaker } from "test/e2e/helper/api-key.faker";
import { AuthFaker } from "test/e2e/helper/auth.faker";
import { UserFaker } from "test/e2e/helper/user.faker";

describe("cpu public list e2e", () => {
  const CPU_LIST_URL = "/public/cpu/list";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let xApiKey: string;
  let userAccessToken: string;
  let adminAccessToken: string;
  let user: UserDoc;
  let admin: UserDoc;

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

    // create user
    admin = await userFaker.createAdmin({});
    user = await userFaker.createUser({});
    await Promise.all([userFaker.createSuperAdmin({}), userFaker.createUser({ deleted: true })]);

    // login by user
    const loginResponse = await Promise.all([
      authFaker.login({ email: admin.email, xApiKey }),
      authFaker.login({ email: user.email, xApiKey }),
    ]);

    // get accessToken
    adminAccessToken = loginResponse[0];
    userAccessToken = loginResponse[1];
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
      const { status, body } = await request(app.getHttpServer()).get(CPU_LIST_URL);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
    });
  });
  describe("query", () => {
    beforeAll(async () => {
      const modRef: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = modRef.createNestApplication();
      await app.init();
    });
    it("should return 200 when user request list success", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(CPU_LIST_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(200);
      expect(body._metadata.pagination).toBeDefined();
      expect(body.data).toBeDefined();
    });
    it("should return 200 when admin request list success", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(CPU_LIST_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body._metadata.pagination).toBeDefined();
      expect(body.data).toBeDefined();
    });
  });
});
