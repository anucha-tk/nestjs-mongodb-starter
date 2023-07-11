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
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { faker } from "@faker-js/faker";
import { ApiKeyDoc } from "src/common/api-key/repository/entities/api-key.entity";

describe("api-key get e2e", () => {
  const APIKEY_GET_URL = "/admin/api-key/get";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let admin: UserDoc;
  let xApiKey: string;
  let adminAccessToken: string;
  let apiKeyDoc: ApiKeyDoc;

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
    apiKeyDoc = apiKeyRes.doc;
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

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
    await app.close();
  });

  describe(`Get ${APIKEY_GET_URL}`, () => {
    it("should throw 400 when apiKey is not uuid", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`${APIKEY_GET_URL}/123`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
    });
    it("should throw 404 when apiKey is not found", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`${APIKEY_GET_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR);
    });
    it("should return apikey", async () => {
      const { body, status } = await request(app.getHttpServer())
        .get(`${APIKEY_GET_URL}/${apiKeyDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
    });
  });
});
