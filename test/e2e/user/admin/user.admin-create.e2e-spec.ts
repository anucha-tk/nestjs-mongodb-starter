import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "src/common/auth/constants/auth.status-code.constant";
import { AuthService } from "src/common/auth/services/auth.service";
import { ENUM_POLICY_STATUS_CODE_ERROR } from "src/common/policy/constants/policy.status-code.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { RoleService } from "src/modules/role/services/role.service";
import { ENUM_USER_SIGN_UP_FROM } from "src/modules/user/constants/user.enum.constant";
import { ENUM_USER_STATUS_CODE_ERROR } from "src/modules/user/constants/user.status-code.constant";
import { UserCreateDto } from "src/modules/user/dtos/user.create.dto";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { ApiKeyFaker } from "test/e2e/helper/api-key.faker";
import { AuthFaker } from "test/e2e/helper/auth.faker";
import { RoleFaker } from "test/e2e/helper/role.faker";
import { UserFaker } from "test/e2e/helper/user.faker";

describe("user create e2e", () => {
  const USER_CREATE_URL = "/admin/user/create";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let xApiKey: string;
  let userAccessToken: string;
  let adminAccessToken: string;
  let adminUnPolicyAccessToken: string;
  let roleUserId: string;
  let roleUserInActiveId: string;
  let user: UserDoc;

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
    const roleFaker = new RoleFaker(roleService);
    const authFaker = new AuthFaker(app);

    const apiKey = await apiKeyFaker.createApiKey({});
    xApiKey = apiKeyFaker.getXApiKey(apiKey);

    roleUserId = await roleFaker.createRoleUser({}).then((e) => e._id);
    roleUserInActiveId = await roleFaker.createRoleUser({ isActive: false }).then((e) => e._id);

    // create user
    const admin = await userFaker.createAdmin({});
    const adminUnPolicy = await userFaker.createAdmin({ permissions: [] });
    user = await userFaker.createUser({});

    // login by user
    const loginResponse = await Promise.all([
      authFaker.login({ email: admin.email, xApiKey }),
      authFaker.login({ email: adminUnPolicy.email, xApiKey }),
      authFaker.login({ email: user.email, xApiKey }),
    ]);

    // get accessToken
    adminAccessToken = loginResponse[0];
    adminUnPolicyAccessToken = loginResponse[1];
    userAccessToken = loginResponse[2];
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
      const { status, body } = await request(app.getHttpServer()).post(USER_CREATE_URL);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
    });
  });
  describe("auth", () => {
    it("should return 401 when not auth", async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey);

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR);
    });
    it("should return 403 when not admin or superAdmin", async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userAccessToken}`);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR);
    });
    it("should return 403 when not admin not have user policy", async () => {
      const userCreateDto: UserCreateDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        role: roleUserId,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
      };

      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminUnPolicyAccessToken}`)
        .send(userCreateDto);

      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_POLICY_STATUS_CODE_ERROR.POLICY_ABILITY_FORBIDDEN_ERROR);
    });
  });
  describe("guard", () => {
    it("should return 404 when roleId not found", async () => {
      const userCreateDto: UserCreateDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        role: faker.string.uuid(),
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
      };
      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`)
        .send(userCreateDto);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR);
    });
    it("should return 400 when roleId inActive", async () => {
      const userCreateDto: UserCreateDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        role: roleUserInActiveId,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
      };

      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`)
        .send(userCreateDto);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_ACTIVE_ERROR);
    });
    it("should return 400 when user email exist", async () => {
      jest.spyOn(userService, "existByEmail").mockResolvedValue(true);
      const userCreateDto: UserCreateDto = {
        email: user.email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        role: roleUserId,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
      };
      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`)
        .send(userCreateDto);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR);
    });
    it("should return 400 when user userName exist", async () => {
      const userCreateDto: UserCreateDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        role: roleUserId,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
        userName: user.username,
      };
      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`)
        .send(userCreateDto);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR);
    });
    it("should return 400 when user mobileNumber exist", async () => {
      const userCreateDto: UserCreateDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        role: roleUserId,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
        mobileNumber: user.mobileNumber,
      };
      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`)
        .send(userCreateDto);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR);
    });
  });
  describe("create response", () => {
    it("should return 200 when create user successful", async () => {
      const userCreateDto: UserCreateDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        role: roleUserId,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
        mobileNumber: faker.phone.number("##########"),
        userName: faker.person.middleName(),
      };
      const { status, body } = await request(app.getHttpServer())
        .post(USER_CREATE_URL)
        .set("x-api-key", xApiKey)
        .set("authorization", `Bearer ${adminAccessToken}`)
        .send(userCreateDto);

      expect(status).toBe(201);
      expect(body._metadata).toBeDefined();
      expect(body.data).toBeDefined();
      expect(body.data).toHaveProperty("username", userCreateDto.userName?.toLowerCase());
      expect(body.data).toHaveProperty("mobileNumber", userCreateDto.mobileNumber);
    });
  });
});
