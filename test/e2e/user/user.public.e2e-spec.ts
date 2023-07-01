import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { AuthService } from "src/common/auth/services/auth.service";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { RoleService } from "src/modules/role/services/role.service";
import {
  ENUM_USER_STATUS_CODE_ERROR,
  ENUM_USER_STATUS_CODE_SUCCESS,
} from "src/modules/user/constants/user.status-code.constant";
import { UserLoginDto } from "src/modules/user/dtos/user.login.dto";
import { UserSignUpDto } from "src/modules/user/dtos/user.signup.dto";
import { IUserDoc } from "src/modules/user/interfaces/user.interface";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "../helper/apiKey";
import { createRoleUser } from "../helper/role";
import { createUser, mockPassword } from "../helper/user";

describe("user public e2e", () => {
  const USER_SIGNUP_URL = "/public/user/sign-up";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let authService: AuthService;
  let user: UserDoc;
  let xApiKey: string;

  beforeEach(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    userService = modRef.get<UserService>(UserService);
    roleService = modRef.get<RoleService>(RoleService);
    authService = modRef.get<AuthService>(AuthService);
    await app.init();

    // create userRole
    const [roleUser, apiKeyRes] = await Promise.all([
      createRoleUser(app, "user"),
      createApiKey(app),
    ]);

    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;

    // create user
    user = await createUser({ app, roleId: roleUser._id });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe("login", () => {
    describe("dto", () => {
      it("should return 422 when empty body", async () => {
        const { body, status } = await request(app.getHttpServer())
          .post("/public/user/login")
          .set("x-api-key", xApiKey);

        expect(body).toBeDefined();
        expect(status).toBe(422);
        expect(body.message).toMatch(/Validation error/i);
        expect(body.errors).toBeDefined();
      });

      it("should return 422 when empty password", async () => {
        const loginDto: UserLoginDto = {
          email: faker.internet.email(),
          password: "",
        };
        const { body, status } = await request(app.getHttpServer())
          .post("/public/user/login")
          .set("x-api-key", xApiKey)
          .set("application", "json")
          .send(loginDto);

        expect(body).toBeDefined();
        expect(status).toBe(422);
        expect(body.message).toMatch(/Validation error/i);
        expect(body.errors).toBeDefined();
      });

      it("should return 422 when empty email", async () => {
        const loginDto: UserLoginDto = {
          email: "",
          password: faker.string.alphanumeric(8),
        };
        const { body, status } = await request(app.getHttpServer())
          .post("/public/user/login")
          .set("x-api-key", xApiKey)
          .set("application", "json")
          .send(loginDto);

        expect(body).toBeDefined();
        expect(status).toBe(422);
        expect(body.message).toMatch(/Validation error/i);
        expect(body.errors).toBeDefined();
      });
    });

    it("should return 404 when user not found", async () => {
      const loginDto: UserLoginDto = {
        email: faker.internet.email(),
        password: faker.string.alphanumeric(8),
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(404);
      expect(body.message).toMatch(/User not found/i);
    });

    it("should return 400 when password not match", async () => {
      const loginDto: UserLoginDto = {
        email: user.email,
        password: "123456",
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(400);
      expect(body.message).toMatch(/password not match/i);
    });

    it("should return 403 when user is block", async () => {
      user.blocked = true;

      jest.spyOn(userService, "findOneByEmail").mockResolvedValue(user);

      const loginDto: UserLoginDto = {
        email: user.email,
        password: mockPassword,
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(403);
      expect(body.message).toMatch(/blocked/i);
    });

    it("should return 403 when user is inactivePermanent", async () => {
      user.inactivePermanent = true;
      jest.spyOn(userService, "findOneByEmail").mockResolvedValue(user);

      const loginDto: UserLoginDto = {
        email: user.email,
        password: mockPassword,
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(403);
      expect(body.message).toMatch(/inactive permanent/i);
    });
    it("should return 403 when user is isActive", async () => {
      user.isActive = false;
      jest.spyOn(userService, "findOneByEmail").mockResolvedValue(user);

      const loginDto: UserLoginDto = {
        email: user.email,
        password: mockPassword,
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(403);
      expect(body.message).toMatch(/inactive/i);
    });
    it("should return 403 when role is inActive", async () => {
      jest
        .spyOn(userService, "joinWithRole")
        .mockResolvedValue({ ...user, role: { isActive: false } } as IUserDoc);

      const loginDto: UserLoginDto = {
        email: user.email,
        password: mockPassword,
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR);
    });
    it.skip("should return 403 when passwordExpired", async () => {
      // NOTE: we remove check passwordExpired on login api, so skip test
      jest.spyOn(authService, "checkPasswordExpired").mockResolvedValue(true);
      const loginDto: UserLoginDto = {
        email: user.email,
        password: mockPassword,
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(403);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_SUCCESS.USER_PASSWORD_EXPIRED_ERROR);
    });
    it("should return 200 when login successful", async () => {
      const loginDto: UserLoginDto = {
        email: user.email,
        password: mockPassword,
      };
      const { body, status } = await request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .set("application", "json")
        .send(loginDto);

      expect(body).toBeDefined();
      expect(status).toBe(200);
      expect(body.data).toHaveProperty("accessToken");
      expect(body.data).toHaveProperty("refreshToken");
    });

    describe("attempt", () => {
      // WARN: should last because it to many request
      beforeAll(async () => {
        const modRef: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = modRef.createNestApplication();
        userService = modRef.get<UserService>(UserService);
        roleService = modRef.get<RoleService>(RoleService);
        await app.init();
      });

      afterAll(async () => {
        jest.clearAllMocks();
        await userService.deleteMany({});
        await roleService.deleteMany({});
      });

      it("should return 403 when passwordAttemptMax", async () => {
        const loginDto: UserLoginDto = {
          email: user.email,
          password: "123456",
        };

        let attempt = 0;
        while (attempt < 6) {
          await request(app.getHttpServer())
            .post("/public/user/login")
            .set("application", "json")
            .set("x-api-key", xApiKey)
            .send(loginDto);
          attempt++;
        }

        const { body, status } = await request(app.getHttpServer())
          .post("/public/user/login")
          .set("application", "json")
          .set("x-api-key", xApiKey)
          .send({ email: user.email, password: mockPassword });

        expect(status).toBe(403);
        expect(body.message).toMatch(/Password attempt user max/i);
      });
    });
  });
  describe(`${USER_SIGNUP_URL}`, () => {
    it("should throw user exist", async () => {
      const signupDto: UserSignUpDto = {
        email: user.email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
      };
      const { body, status } = await request(app.getHttpServer())
        .post(`${USER_SIGNUP_URL}`)
        .set("application", "json")
        .set("x-api-key", xApiKey)
        .send(signupDto);

      expect(status).toBe(409);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR);
    });
    it("should throw phoneNumber exist", async () => {
      const signupDto: UserSignUpDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        mobileNumber: user.mobileNumber,
      };
      const { body, status } = await request(app.getHttpServer())
        .post(`${USER_SIGNUP_URL}`)
        .set("application", "json")
        .set("x-api-key", xApiKey)
        .send(signupDto);

      expect(status).toBe(409);
      expect(body.statusCode).toBe(ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR);
    });

    it("should return void when signup successful", async () => {
      const signupDto: UserSignUpDto = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.string.alphanumeric(8),
        mobileNumber: faker.phone.number("##########"),
      };
      const { status } = await request(app.getHttpServer())
        .post(`${USER_SIGNUP_URL}`)
        .set("application", "json")
        .set("x-api-key", xApiKey)
        .send(signupDto);

      expect(status).toBe(201);
    });
  });
});
