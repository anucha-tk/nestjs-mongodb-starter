import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { ENUM_CPU_STATUS_CODE_ERROR } from "src/modules/cpu/constants/cpu.status-code.constant";
import { CPUDoc } from "src/modules/cpu/repository/entities/cpu.entity";
import { CPUService } from "src/modules/cpu/services/cpu.service";
import request from "supertest";
import { ApiKeyFaker } from "test/e2e/helper/api-key.faker";
import { CPUFaker } from "test/e2e/helper/cpu.faker";

describe("cpu public getById e2e", () => {
  const CPU_GET_URL = "/public/cpu/get";
  let app: INestApplication;
  let apiKeyService: ApiKeyService;
  let cPUService: CPUService;
  let xApiKey: string;
  let cPUDoc: CPUDoc;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    apiKeyService = modRef.get<ApiKeyService>(ApiKeyService);
    cPUService = modRef.get<CPUService>(CPUService);
    await app.init();

    const apiKeyFaker = new ApiKeyFaker(apiKeyService);
    const cPUFaker = new CPUFaker(cPUService);

    const apiKey = await apiKeyFaker.createApiKey({});
    xApiKey = apiKeyFaker.getXApiKey(apiKey);

    cPUDoc = await cPUFaker.create({});
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await apiKeyService.deleteMany({});
    await cPUService.deleteMany({});
    await app.close();
  });

  describe("x-api-key", () => {
    it("should return 401 when not send x-api-key", async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `${CPU_GET_URL}/${faker.string.uuid()}`,
      );

      expect(status).toBe(401);
      expect(body.statusCode).toBe(ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NEEDED_ERROR);
    });
  });
  describe("guard", () => {
    it("should turn 400 when cpu not uuid", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`${CPU_GET_URL}/123`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(400);
      expect(body.statusCode).toBe(ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR);
    });
    it("should turn 404 when cpu not found", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`${CPU_GET_URL}/${faker.string.uuid()}`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(404);
      expect(body.statusCode).toBe(ENUM_CPU_STATUS_CODE_ERROR.CPU_NOT_FOUND_ERROR);
    });
  });
  describe("response", () => {
    it("should return cpuDoc", async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`${CPU_GET_URL}/${cPUDoc._id}`)
        .set("x-api-key", xApiKey);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data._id).toBe(cPUDoc._id);
      expect(body.data.createdAt).toBeDefined();
      expect(body.data.updatedAt).toBeDefined();
    });
  });
});
