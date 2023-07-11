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
import { ApiKeyDoc } from "src/common/api-key/repository/entities/api-key.entity";
import { faker } from "@faker-js/faker";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { useContainer } from "class-validator";

describe("api-key active e2e", () => {
  const BASE_URL = "/admin/api-key";
  const APIKEY_UPDATE_URL = `${BASE_URL}/update`;
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let admin: UserDoc;
  let xApiKey: string;
  let xApiKeyTwo: string;
  let adminAccessToken: string;
  let apiKeyDoc: ApiKeyDoc;
  let apiKeyTwoDoc: ApiKeyDoc;

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
    const [apiKeyRes, apiKeyResTwo, roleAdmin] = await Promise.all([
      createApiKey(app),
      createApiKey(app),
      createRoleAdmin(app, "admin"),
    ]);
    apiKeyDoc = apiKeyRes.doc;
    apiKeyTwoDoc = apiKeyResTwo.doc;
    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;
    xApiKeyTwo = `${apiKeyResTwo.doc.key}:${apiKeyResTwo.secret}`;

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
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
    await app.close();
  });

  describe(`Patch ${APIKEY_UPDATE_URL}/:apiKey/active`, () => {
    it("should return 400 when apikey not uuid", async () => {
      const apiKeyId = "123";
      const { body, status } = await request(app.getHttpServer())
        .patch(`${APIKEY_UPDATE_URL}/${apiKeyId}/active`)
        .set("x-api-key", xApiKeyTwo)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body).toBeDefined();
      expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
    });
    it("should return 404 when apikey not found", async () => {
      const apiKeyId = faker.string.uuid();
      const { body, status } = await request(app.getHttpServer())
        .patch(`${APIKEY_UPDATE_URL}/${apiKeyId}/active`)
        .set("x-api-key", xApiKeyTwo)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body).toBeDefined();
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR);
    });
    it("should return 400 when apikey active", async () => {
      const apiKeyId = apiKeyTwoDoc._id;
      const { body, status } = await request(app.getHttpServer())
        .patch(`${APIKEY_UPDATE_URL}/${apiKeyId}/active`)
        .set("x-api-key", xApiKeyTwo)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body).toBeDefined();
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_IS_ACTIVE_ERROR);
    });
    it("should return 400 when apikey expired", async () => {
      jest.spyOn(apiKeyService, "findOneById").mockResolvedValue({
        _id: apiKeyTwoDoc._id,
        isActive: false,
        startDate: faker.date.recent(),
        endDate: faker.date.past(),
      } as ApiKeyDoc);
      const apiKeyId = apiKeyTwoDoc._id;
      const { body, status } = await request(app.getHttpServer())
        .patch(`${APIKEY_UPDATE_URL}/${apiKeyId}/active`)
        .set("x-api-key", xApiKeyTwo)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body).toBeDefined();
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR);
    });
    it("should return 200 when active api successful", async () => {
      const apiKeyId = apiKeyDoc._id;
      await request(app.getHttpServer())
        .patch(`${APIKEY_UPDATE_URL}/${apiKeyId}/inactive`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      const { body, status } = await request(app.getHttpServer())
        .patch(`${APIKEY_UPDATE_URL}/${apiKeyId}/active`)
        .set("x-api-key", xApiKeyTwo)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
      expect(body).toBeDefined();
    });
  });
});
