import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { RoleService } from "src/modules/role/services/role.service";
import { ENUM_USER_STATUS_CODE_ERROR } from "src/modules/user/constants/user.status-code.constant";
import { UserSignUpDto } from "src/modules/user/dtos/user.signup.dto";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import request from "supertest";
import { createApiKey } from "../helper/apiKey";
import { createRoleUser } from "../helper/role";
import { createUser } from "../helper/user";

describe("user public signup e2e", () => {
  const USER_SIGNUP_URL = "/public/user/sign-up";
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
    user = await createUser({ app, roleId: roleUser._id }).then((e) => e.toObject());
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
