import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "src/common/auth/constants/auth.status-code.constant";
import { ENUM_POLICY_STATUS_CODE_ERROR } from "src/common/policy/constants/policy.status-code.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "test/e2e/helper/apiKey";
import { createRoleAdmin, createRoleUser } from "test/e2e/helper/role";
import { createAdmin, createUser, mockPassword } from "test/e2e/helper/user";

describe("user admin e2e", () => {
  const USER_LIST_URL = "/admin/user/list";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let user: UserDoc;
  let admin: UserDoc;
  let adminUnPolicy: UserDoc;
  let xApiKey: string;
  let userAccessToken: string;
  let adminAccessToken: string;
  let adminUnPolicyAccessToken: string;

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
    const [apiKeyRes, roleUser, roleAdmin, roleAdminUnPolicy] = await Promise.all([
      createApiKey(app),
      createRoleUser(app, "user"),
      createRoleAdmin(app, "admin"),
      createRoleAdmin(app, "adminUnPolicy", []),
    ]);
    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;

    // create user
    user = await createUser({ app, roleId: roleUser._id });
    admin = await createAdmin({ app, roleId: roleAdmin._id });
    adminUnPolicy = await createAdmin({ app, roleId: roleAdminUnPolicy._id });

    // login by user
    const [adminRes, userRes, adminUnPolicyRes] = await Promise.all([
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: admin.email, password: mockPassword })
        .set("x-api-key", xApiKey),
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: user.email, password: mockPassword })
        .set("x-api-key", xApiKey),
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: adminUnPolicy.email, password: mockPassword })
        .set("x-api-key", xApiKey),
    ]);

    // get accessToken
    adminAccessToken = adminRes.body.data.accessToken;
    userAccessToken = userRes.body.data.accessToken;
    adminUnPolicyAccessToken = adminUnPolicyRes.body.data.accessToken;
  });

  beforeEach(() => {
    jest.restoreAllMocks();
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
      const { status, body } = await request(app.getHttpServer()).get(USER_LIST_URL);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
    });
  });
  describe("auth", () => {
    it("should return 401 when not auth", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(USER_LIST_URL)
        .set("x-api-key", xApiKey);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
    });
    it("should return 403 when not admin or superAdmin", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(USER_LIST_URL)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR);
    });
    it("should return 403 when not admin not have user policy", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(USER_LIST_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminUnPolicyAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_POLICY_STATUS_CODE_ERROR.POLICY_ABILITY_FORBIDDEN_ERROR);
    });
  });
  describe("query", () => {
    it("should return 200 when list success", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(USER_LIST_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body._metadata.pagination).toBeDefined();
      expect(body.data.length).toBeTruthy();
    });
    describe("page", () => {
      it("should return 3 user by default maxPerPage 20", async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_LIST_URL}?perPage=20`)
          .set("x-api-key", xApiKey)
          .set("authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(200);
        expect(body._metadata.pagination).toBeDefined();
        expect(body.data).toHaveLength(3);
      });
      it("should return 2 user by default maxPerPage 2", async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_LIST_URL}?perPage=2`)
          .set("x-api-key", xApiKey)
          .set("authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(200);
        expect(body._metadata.pagination).toBeDefined();
        expect(body.data).toHaveLength(2);
      });
      it("should return 1 user by default maxPerPage 2 and page 2", async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_LIST_URL}?perPage=2&page=2`)
          .set("x-api-key", xApiKey)
          .set("authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(200);
        expect(body._metadata.pagination).toBeDefined();
        expect(body.data).toHaveLength(1);
      });
    });
    describe("search", () => {
      it("should return 200 and single user when search user", async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_LIST_URL}?search=user`)
          .set("x-api-key", xApiKey)
          .set("authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(200);
        expect(body._metadata.pagination).toBeDefined();
        expect(body.data).toHaveLength(1);
      });
      it("should return 200 and 2 user when search admin", async () => {
        const { status, body } = await request(app.getHttpServer())
          .get(`${USER_LIST_URL}?search=admin`)
          .set("x-api-key", xApiKey)
          .set("authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(200);
        expect(body._metadata.pagination).toBeDefined();
        expect(body.data).toHaveLength(2);
      });
    });
  });
});
