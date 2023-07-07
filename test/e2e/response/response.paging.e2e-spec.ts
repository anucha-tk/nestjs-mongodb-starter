import request from "supertest";
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
import { isArray } from "lodash";

describe("paging", () => {
  const LIST_API_URL = "/admin/api-key/list";
  let app: INestApplication;
  let userService: UserService;
  let roleService: RoleService;
  let apiKeyService: ApiKeyService;
  let admin: UserDoc;
  let adminAccessToken: string;
  let xApiKey: string;

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
    const [roleAdmin] = await Promise.all([createRoleAdmin(app, "admin")]);

    // create user
    const [adminRes, apiKeyRes] = await Promise.all([
      createAdmin({ app, roleId: roleAdmin._id }),
      createApiKey(app),
    ]);
    admin = adminRes;
    xApiKey = `${apiKeyRes.doc.key}:${apiKeyRes.secret}`;

    // login by user
    const responses = await Promise.all([
      request(app.getHttpServer())
        .post("/public/user/login")
        .set("x-api-key", xApiKey)
        .send({ email: admin.email, password: mockPassword }),
    ]);

    // get accessToken
    adminAccessToken = responses[0].body.data.accessToken;
  });

  afterAll(async () => {
    await userService.deleteMany({});
    await roleService.deleteMany({});
    await apiKeyService.deleteMany({});
    jest.clearAllMocks();
    await app.close();
  });
  it(`should return paging property response on ${LIST_API_URL}`, async () => {
    const { body, status } = await request(app.getHttpServer())
      .get(`${LIST_API_URL}`)
      .set("x-api-key", xApiKey)
      .set("Authorization", `Bearer ${adminAccessToken}`);

    expect(status).toBe(200);
    expect(body._metadata).toHaveProperty("pagination");
    expect(isArray(body.data)).toBeTruthy();
  });
});
