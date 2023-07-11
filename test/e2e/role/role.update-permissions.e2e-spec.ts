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
import { RoleDoc } from "src/modules/role/repository/entities/role.entity";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "../helper/apiKey";
import { createInActiveRoleUser, createRoleAdmin, createRoleUser } from "../helper/role";
import { createAdmin, createUser, mockPassword } from "../helper/user";

describe("role updatePermissions e2e", () => {
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
  let roleInActiveUserDoc: RoleDoc;

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
    const [roleUser, roleAdmin, roleInActiveUser] = await Promise.all([
      createRoleUser(app, "user"),
      createRoleAdmin(app, "admin"),
      createInActiveRoleUser(app, "inactive public"),
    ]);
    roleUserDoc = roleUser;
    roleInActiveUserDoc = roleInActiveUser;

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

  describe(`PATCH ${UPDATE_URL}/role/permissions`, () => {
    describe("x-api-key", () => {
      it("should return 401 when not send x-api-key", async () => {
        const { status, body } = await request(app.getHttpServer()).put(
          `${UPDATE_URL}/${roleInActiveUserDoc._id}/permissions`,
        );

        expect(status).toBe(401);
        expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
      });
    });
    describe("auth", () => {
      it("should return 401 when not auth", async () => {
        const { status, body } = await request(app.getHttpServer())
          .put(`${UPDATE_URL}/${roleInActiveUserDoc._id}/permissions`)
          .set("x-api-key", xApiKey);

        expect(status).toBe(401);
        expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
      });
      it("should return 403 when not admin or superAdmin", async () => {
        const { status, body } = await request(app.getHttpServer())
          .put(`${UPDATE_URL}/${roleInActiveUserDoc._id}/permissions`)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${userAccessToken}`);

        expect(status).toBe(403);
        expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR);
      });
    });
    describe("get guard", () => {
      it("should return 400 when role id not uuid", async () => {
        const { status, body } = await request(app.getHttpServer())
          .put(`${UPDATE_URL}/123/permissions`)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(400);
        expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
      });
      it("should return 404 when not not found role", async () => {
        const { status, body } = await request(app.getHttpServer())
          .put(`${UPDATE_URL}/${faker.string.uuid()}/permissions`)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(404);
        expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR);
      });
      it("should return 400 when role inActive yet", async () => {
        const { status, body } = await request(app.getHttpServer())
          .put(`${UPDATE_URL}/${roleInActiveUserDoc._id}/permissions`)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(400);
        expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_ACTIVE_ERROR);
      });
      it("should return 422 when empty body", async () => {
        const { status, body } = await request(app.getHttpServer())
          .put(`${UPDATE_URL}/${roleUserDoc._id}/permissions`)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${adminAccessToken}`);

        expect(status).toBe(422);
        expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
      });
    });
    describe("role updatePermissions logic", () => {
      it("should return 200 when updatePermissions role successful", async () => {
        const { status, body } = await request(app.getHttpServer())
          .put(`${UPDATE_URL}/${roleUserDoc._id}/permissions`)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${adminAccessToken}`)
          .send({
            type: ENUM_ROLE_TYPE.ADMIN,
            permissions: [{ subject: ENUM_POLICY_SUBJECT.ROLE, action: [ENUM_POLICY_ACTION.READ] }],
          });

        expect(status).toBe(200);
        expect(body.data).toHaveProperty("_id");
        expect(body.data.type).toBe("ADMIN");

        expect(body.data.permissions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              subject: ENUM_POLICY_SUBJECT.ROLE,
              action: [ENUM_POLICY_ACTION.READ],
            }),
          ]),
        );
      });
    });
  });
});
