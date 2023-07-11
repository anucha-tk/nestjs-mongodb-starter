import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { RoleService } from "src/modules/role/services/role.service";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import { createApiKey } from "../helper/apiKey";
import { createRoleUser } from "../helper/role";
import { createUser, mockPassword } from "../helper/user";
import request from "supertest";
import { ENUM_AUTH_STATUS_CODE_ERROR } from "src/common/auth/constants/auth.status-code.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { IUserDoc } from "src/modules/user/interfaces/user.interface";

describe("user auth e2e", () => {
  const USER_REFRESH_URL = "/auth/user/refresh";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let user: UserDoc;
  let xApiKey: string;
  let userRefreshToken: string;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = modRef.get<UserService>(UserService);
    roleService = modRef.get<RoleService>(RoleService);
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

    userRefreshToken = userRes.body.data.refreshToken;
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await app.close();
  });
  describe(`Post ${USER_REFRESH_URL}`, () => {
    it("should throw 401 when refreshToken on header not exist", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(`${USER_REFRESH_URL}`)
        .set("x-api-key", xApiKey);

      expect(body).toBeDefined();
      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_REFRESH_TOKEN_ERROR);
    });
    it("should throw 403 when role inactive", async () => {
      jest
        .spyOn(userService, "joinWithRole")
        .mockResolvedValue({ ...user, role: { isActive: false } } as IUserDoc);
      const { body, status } = await request(app.getHttpServer())
        .post(`${USER_REFRESH_URL}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userRefreshToken}`);

      expect(body).toBeDefined();
      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR);
    });
    it("should IResponse accessToken and refreshToken when refresh successful", async () => {
      // NOTE: JWT.sign not sign new accessToken, i think because we login then refresh jwt sign return old accessToken
      // we test on postman is not problem, we receive new accessToken
      const { body, status } = await request(app.getHttpServer())
        .post(`${USER_REFRESH_URL}`)
        .set("x-api-key", xApiKey)
        .set("Authorization", `Bearer ${userRefreshToken}`);

      expect(body).toBeDefined();
      expect(status).toBe(200);
      expect(body.data).toHaveProperty("tokenType");
      expect(body.data).toHaveProperty("expiresIn");
      expect(body.data).toHaveProperty("accessToken");
      expect(body.data).toHaveProperty("refreshToken");
      expect(body.data.refreshToken).toEqual(userRefreshToken);
    });
  });
});
