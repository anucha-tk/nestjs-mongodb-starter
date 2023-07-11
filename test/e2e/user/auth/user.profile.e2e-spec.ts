import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "src/common/auth/constants/auth.status-code.constant";
import { createRoleUser } from "test/e2e/helper/role";
import { createApiKey } from "test/e2e/helper/apiKey";
import { createUser, mockPassword } from "test/e2e/helper/user";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";

describe("user profile e2e", () => {
  const USER_PROFILE_URL = "/auth/user/profile";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let user: UserDoc;
  let xApiKey: string;
  let userAccessToken: string;

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
    const [roleUser, apiKeyRes] = await Promise.all([
      createRoleUser(app, "user"),
      createApiKey(app),
    ]);

    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;

    // create user
    user = await createUser({ app, roleId: roleUser._id });

    const userRes = await request(app.getHttpServer())
      .post("/public/user/login")
      .send({ email: user.email, password: mockPassword })
      .set("x-api-key", xApiKey);
    userAccessToken = userRes.body.data.accessToken;
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
    await app.close();
  });

  describe(`GET ${USER_PROFILE_URL}`, () => {
    describe("x-api-key", () => {
      it("should return 401 when not send x-api-key", async () => {
        const { status, body } = await request(app.getHttpServer()).get(USER_PROFILE_URL);

        expect(status).toBe(401);
        expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
      });
    });
    describe("auth", () => {
      it("should return 401 when not auth", async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(USER_PROFILE_URL)
          .set("x-api-key", xApiKey);

        expect(status).toBe(401);
        expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
      });
    });
    describe("user response", () => {
      it("should return 200 and user info when successful", async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(USER_PROFILE_URL)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${userAccessToken}`);

        expect(status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data).toHaveProperty("_id");
        expect(body.data).toHaveProperty("firstName");
        expect(body.data).toHaveProperty("lastName");
        expect(body.data).toHaveProperty("email");
        expect(body.data).toHaveProperty("role");
        expect(body.data).toHaveProperty("signUpDate");
        expect(body.data).toHaveProperty("signUpFrom");
      });
    });
  });
});
