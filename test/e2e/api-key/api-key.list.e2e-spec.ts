import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import { createApiKey } from "../helper/apiKey";
import { createRoleAdmin } from "../helper/role";
import { createAdmin, mockPassword } from "../helper/user";
import request from "supertest";
import { useContainer } from "class-validator";

describe("api-key list e2e", () => {
  const APIKEY_LIST_URL = "/admin/api-key/list";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let admin: UserDoc;
  let xApiKey: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = modRef.get<UserService>(UserService);
    roleService = modRef.get<RoleService>(RoleService);
    apiKeyService = modRef.get<ApiKeyService>(ApiKeyService);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();

    // create Api & Role
    const [apiKeyRes, roleAdmin] = await Promise.all([
      createApiKey(app),
      createRoleAdmin(app, "admin"),
    ]);
    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;

    // create user
    admin = await createAdmin({ app, roleId: roleAdmin._id });

    // login by user
    const [adminRes] = await Promise.all([
      request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: admin.email, password: mockPassword })
        .set("x-api-key", xApiKey),
    ]);

    // get accessToken
    adminAccessToken = adminRes.body.data.accessToken;
  });
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
    await app.close();
  });

  describe(`Get ${APIKEY_LIST_URL}`, () => {
    it("should return apikeys", async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(`${APIKEY_LIST_URL}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body._metadata.pagination).toBeDefined();
    });
  });
});
