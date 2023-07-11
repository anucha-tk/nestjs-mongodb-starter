import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import { createApiKey } from "../helper/apiKey";
import { createRoleAdmin, createRoleUser } from "../helper/role";
import { createAdmin, mockPassword } from "../helper/user";
import request from "supertest";
import { ApiKeyDoc } from "src/common/api-key/repository/entities/api-key.entity";
import { faker } from "@faker-js/faker";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { ENUM_POLICY_STATUS_CODE_ERROR } from "src/common/policy/constants/policy.status-code.constant";
import { useContainer } from "class-validator";

describe("api-key delete e2e", () => {
  const BASE_URL = "/admin/api-key";
  const APIKEY_DELETE_URL = `${BASE_URL}/delete`;
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let admin: UserDoc;
  let user: UserDoc;
  let xApiKey: string;
  let xApiKeyTwo: string;
  let adminAccessToken: string;
  let userAccessToken: string;
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
    const [apiKeyRes, apiKeyResTwo, roleAdmin, roleUser] = await Promise.all([
      createApiKey(app),
      createApiKey(app),
      createRoleAdmin(app, "admin"),
      createRoleUser(app, "user"),
    ]);
    apiKeyDoc = apiKeyRes.doc;
    apiKeyTwoDoc = apiKeyResTwo.doc;
    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;
    xApiKeyTwo = `${apiKeyResTwo.doc.key}:${apiKeyResTwo.secret}`;

    // create user
    admin = await createAdmin({ app, roleId: roleAdmin._id });
    user = await createAdmin({ app, roleId: roleUser._id });

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

  describe(`DELETE ${APIKEY_DELETE_URL}`, () => {
    it("should return 403 when type role not include SUPER_ADMIN or ADMIN", async () => {
      const { body, status } = await request(app.getHttpServer())
        .delete(`${APIKEY_DELETE_URL}/${apiKeyTwoDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR);
    });
    it("should return 403 when policy not allow", async () => {
      const adminRole = await createRoleAdmin(app, "adminNotAllow", [
        { subject: ENUM_POLICY_SUBJECT.API_KEY, action: [ENUM_POLICY_ACTION.READ] },
      ]);
      const { email } = await createAdmin({ app, roleId: adminRole._id, password: mockPassword });
      const adminRes = await request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email, password: mockPassword })
        .set("x-api-key", xApiKey);

      const { body, status } = await request(app.getHttpServer())
        .delete(`${APIKEY_DELETE_URL}/${apiKeyTwoDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminRes.body.data.accessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_POLICY_STATUS_CODE_ERROR.POLICY_ABILITY_FORBIDDEN_ERROR);
    });

    it("should throw 400 when apiKey not uuid", async () => {
      const { body, status } = await request(app.getHttpServer())
        .delete(`${APIKEY_DELETE_URL}/123`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
    });

    it("should throw 404 when apiKey not found", async () => {
      const { body, status } = await request(app.getHttpServer())
        .delete(`${APIKEY_DELETE_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR);
    });

    it("should return 200 when admin delete apikey successful", async () => {
      const { status } = await request(app.getHttpServer())
        .delete(`${APIKEY_DELETE_URL}/${apiKeyTwoDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(200);
    });

    it("should throw 403 when use apiKey deleted", async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`${APIKEY_DELETE_URL}/${apiKeyDoc._id}`)
        .set("x-api-key", xApiKeyTwo)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR);
    });
  });
});
