import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { RoleService } from "src/modules/role/services/role.service";
import { UserLoginDto } from "src/modules/user/dtos/user.login.dto";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "../helper/apiKey";
import { createRoleUser } from "../helper/role";
import { createUser, mockPassword } from "../helper/user";

describe("user public e2e", () => {
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let user: UserDoc;
  let xApiKey: string;

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
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await userService.deleteMany({});
    await roleService.deleteMany({});
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

    it.todo("should return 403 when user is block");
    it.todo("should return 403 when user is inactivePermanent");
    it.todo("should return 403 when user is isActive");
    it.todo("should return 403 when role is inActive");
    it.todo("should return 403 when passwordExpired");
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
