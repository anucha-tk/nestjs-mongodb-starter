import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "src/common/auth/constants/auth.status-code.constant";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { RoleUpdateDto } from "src/modules/role/dtos/role.update.dto";
import { RoleDoc } from "src/modules/role/repository/entities/role.entity";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "../helper/apiKey";
import { createRoleAdmin, createRoleUser } from "../helper/role";
import { createAdmin, createUser, mockPassword } from "../helper/user";

describe("role update e2e", () => {
  const UPDATE_URL = "/admin/role/update";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
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
    apiKeyService = app.get(ApiKeyService);
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
    await apiKeyService.deleteMany({});
    jest.clearAllMocks();
    await app.close();
  });

  describe(`PUT ${UPDATE_URL}`, () => {
    it("should return 401 when not send x-api-key", async () => {
      const { status, body } = await request(app.getHttpServer()).put(
        `${UPDATE_URL}/${roleUserDoc._id}`,
      );

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
    });
    it("should return 400 when role id not uuid", async () => {
      const { status, body } = await request(app.getHttpServer())
        .put(`${UPDATE_URL}/123`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
    });
    it("should return 401 when not auth", async () => {
      const { status, body } = await request(app.getHttpServer())
        .put(`${UPDATE_URL}/${roleUserDoc._id}`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
    });
    it("should return 403 when not admin or superAdmin", async () => {
      const { status, body } = await request(app.getHttpServer())
        .put(`${UPDATE_URL}/${roleUserDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR);
    });
    it("should return 404 when not not found role", async () => {
      const { status, body } = await request(app.getHttpServer())
        .put(`${UPDATE_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR);
    });
    it("should return 409 when update name is exist", async () => {
      const roleUpdateDto: RoleUpdateDto = {
        name: roleUserDoc.name,
        description: faker.lorem.sentence(),
        type: ENUM_ROLE_TYPE.USER,
        permissions: [],
      };
      const { status, body } = await request(app.getHttpServer())
        .put(`${UPDATE_URL}/${roleUserDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(roleUpdateDto);

      expect(status).toBe(409);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR);
    });
    it("should return 200 when update some role successful", async () => {
      const roleCreateDto: RoleUpdateDto = {
        name: faker.word.words(3),
      };
      const { body, status } = await request(app.getHttpServer())
        .put(`${UPDATE_URL}/${roleUserDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(roleCreateDto);

      expect(status).toBe(200);
      expect(body.data).toHaveProperty("_id");
      expect(body.data).toHaveProperty("name", roleCreateDto.name);
    });
    it("should return 200 when update full role successful", async () => {
      const roleCreateDto: RoleUpdateDto = {
        name: faker.word.words(3),
        description: faker.lorem.sentence(),
        type: ENUM_ROLE_TYPE.USER,
        permissions: [
          {
            subject: ENUM_POLICY_SUBJECT.API_KEY,
            action: [ENUM_POLICY_ACTION.MANAGE],
          },
        ],
        isActive: false,
      };
      const { body, status } = await request(app.getHttpServer())
        .put(`${UPDATE_URL}/${roleUserDoc._id}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(roleCreateDto);

      expect(status).toBe(200);
      expect(body.data).toHaveProperty("_id");
      expect(body.data).toHaveProperty("name", roleCreateDto.name);
      expect(body.data).toHaveProperty("description", roleCreateDto.description);
      expect(body.data).toHaveProperty("type", roleCreateDto.type);
      expect(body.data.permissions[0].subject).toContain(roleCreateDto.permissions[0].subject);
      expect(body.data.permissions[0].action).toEqual(roleCreateDto.permissions[0].action);
      expect(body.data).toHaveProperty("isActive", roleCreateDto.isActive);
    });
  });
});
