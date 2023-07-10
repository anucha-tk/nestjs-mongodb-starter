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
import { UserChangePasswordDto } from "src/modules/user/dtos/user.change-password.dto";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_USER_STATUS_CODE_ERROR } from "src/modules/user/constants/user.status-code.constant";
import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";

describe("user change password e2e", () => {
  const USER_CHANGE_PASSWORD_URL = "/auth/user/change-password";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let configService: ConfigService;
  let user: UserDoc;
  let xApiKey: string;
  let userAccessToken: string;

  beforeEach(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = modRef.get<UserService>(UserService);
    roleService = modRef.get<RoleService>(RoleService);
    apiKeyService = modRef.get<ApiKeyService>(ApiKeyService);
    configService = modRef.get<ConfigService>(ConfigService);
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

  afterEach(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });
  describe(`PATCH ${USER_CHANGE_PASSWORD_URL}`, () => {
    describe("x-api-key", () => {
      it("should return 401 when not send x-api-key", async () => {
        const { status, body } = await request(app.getHttpServer()).patch(USER_CHANGE_PASSWORD_URL);

        expect(status).toBe(401);
        expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
      });
    });
    describe("auth", () => {
      it("should return 401 when not auth", async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch(USER_CHANGE_PASSWORD_URL)
          .set("x-api-key", xApiKey);

        expect(status).toBe(401);
        expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
      });
    });

    describe("body validate", () => {
      it("should return 422 when empty body", async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch(USER_CHANGE_PASSWORD_URL)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${userAccessToken}`);

        expect(status).toBe(422);
        expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
      });
    });
    describe("password attempt true", () => {
      it("should return 403 when first attempt is maxAttempt password", async () => {
        const isAttempt = configService.get("auth.password.attempt");
        const maxAttempt = configService.get("auth.password.maxAttempt");
        if (isAttempt) {
          jest.spyOn(userService, "findOneById").mockResolvedValue({
            _id: faker.string.uuid(),
            passwordAttempt: maxAttempt,
          });
          const { status, body } = await request(app.getHttpServer())
            .patch(USER_CHANGE_PASSWORD_URL)
            .set("x-api-key", xApiKey)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({ newPassword: "abc123", oldPassword: "xyz123" } as UserChangePasswordDto);

          expect(status).toBe(403);
          expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR);
        }
      });
      it("should return 403 when try oldPassword not match and maxAttempt", async () => {
        const isAttempt = configService.get("auth.password.attempt");
        const maxAttempt = configService.get("auth.password.maxAttempt");
        if (isAttempt) {
          let attempt = 0;
          while (attempt < maxAttempt) {
            const { status, body } = await request(app.getHttpServer())
              .patch(USER_CHANGE_PASSWORD_URL)
              .set("x-api-key", xApiKey)
              .set("Authorization", `Bearer ${userAccessToken}`)
              .send({ newPassword: "abc123", oldPassword: "xyz123" } as UserChangePasswordDto);
            attempt++;
            expect(status).toBe(400);
            expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR);
          }
          const { status, body } = await request(app.getHttpServer())
            .patch(USER_CHANGE_PASSWORD_URL)
            .set("x-api-key", xApiKey)
            .set("Authorization", `Bearer ${userAccessToken}`)
            .send({ newPassword: "abc123", oldPassword: "xyz123" } as UserChangePasswordDto);

          expect(status).toBe(403);
          expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR);
        }
      });
    });
    it("should return 400 when old password not match", async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(USER_CHANGE_PASSWORD_URL)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({ newPassword: "abc123", oldPassword: "xyz123" } as UserChangePasswordDto);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR);
    });
  });
  it("should return 400 when newPassword is same oldPassword", async () => {
    const { status, body } = await request(app.getHttpServer())
      .patch(USER_CHANGE_PASSWORD_URL)
      .set("x-api-key", xApiKey)
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send({ newPassword: mockPassword, oldPassword: mockPassword } as UserChangePasswordDto);

    expect(status).toBe(400);
    expect(body.statusCode).toBe(
      ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
    );
  });
  it("should return 200 when update password", async () => {
    const { status } = await request(app.getHttpServer())
      .patch(USER_CHANGE_PASSWORD_URL)
      .set("x-api-key", xApiKey)
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send({
        newPassword: faker.string.alphanumeric(8),
        oldPassword: mockPassword,
      } as UserChangePasswordDto);

    expect(status).toBe(200);
  });
  it("should return 400 when login after update password", async () => {
    const { status } = await request(app.getHttpServer())
      .patch(USER_CHANGE_PASSWORD_URL)
      .set("x-api-key", xApiKey)
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send({
        newPassword: faker.string.alphanumeric(8),
        oldPassword: mockPassword,
      } as UserChangePasswordDto);

    expect(status).toBe(200);

    const response = await request(app.getHttpServer())
      .post("/public/user/login")
      .send({ email: user.email, password: mockPassword })
      .set("x-api-key", xApiKey);

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(
      ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
    );
  });

  it("should return 200 when last attempt update password succeed and can login", async () => {
    const isAttempt = configService.get("auth.password.attempt");
    const maxAttempt = configService.get("auth.password.maxAttempt");
    const newPassword = "abc123";
    if (isAttempt) {
      let attempt = 0;
      // make last attempt
      while (attempt < maxAttempt - 1) {
        const { status, body } = await request(app.getHttpServer())
          .patch(USER_CHANGE_PASSWORD_URL)
          .set("x-api-key", xApiKey)
          .set("Authorization", `Bearer ${userAccessToken}`)
          .send({ newPassword, oldPassword: "xyz123" } as UserChangePasswordDto);
        attempt++;
        expect(status).toBe(400);
        expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR);
      }
      await request(app.getHttpServer())
        .patch(USER_CHANGE_PASSWORD_URL)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`)
        .send({ newPassword, oldPassword: mockPassword } as UserChangePasswordDto);

      const { status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .send({ email: user.email, password: newPassword })
        .set("x-api-key", xApiKey);

      expect(status).toBe(200);
    }
  });
});
