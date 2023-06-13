import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_TYPE } from "src/common/api-key/constants/api-key.enum.constant";
import { ApiKeyRepository } from "src/common/api-key/repository/repositories/api-key.repository";
import request from "supertest";

describe("app", () => {
  let app: INestApplication;
  let apiKeyRepository: ApiKeyRepository;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    apiKeyRepository = app.get<ApiKeyRepository>(ApiKeyRepository);
    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe("/hello", () => {
    it("should return default response", async () => {
      const { body } = await request(app.getHttpServer()).get("/hello");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(200);
      expect(body.message).toMatch(/This is test endpoint service/);
      expect(body._metadata).toBeDefined();
      expect(body.data).toBeDefined();
    });
  });
  describe("/hello/api-key", () => {
    it("should return error 5020 when x-api-key missing", async () => {
      const { body } = await request(app.getHttpServer()).get("/hello/api-key");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5020);
      expect(body.message).toMatch(/Api Key is missing/);
    });

    it("should return error 5020 when x-api-key is empty", async () => {
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5020);
      expect(body.message).toMatch(/Api Key is missing/);
    });

    it("should return error 5025 when x-api-key invalid and not 2 length", async () => {
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "abc");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5025);
      expect(body.message).toMatch(/Invalid API Key/);
    });

    it("should return error when x-api-key not found", async () => {
      jest.spyOn(apiKeyRepository, "findOne").mockResolvedValue(undefined);
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "abc:xyz");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5021);
      expect(body.message).toMatch(/api key not found/i);
    });

    it("should return error when x-api-key is not active", async () => {
      jest.spyOn(apiKeyRepository, "findOne").mockResolvedValue({ isActive: false });
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "abc:xyz");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5022);
      expect(body.message).toMatch(/Auth API Inactive/i);
    });

    it("should return error when not active yet", async () => {
      const currentDate = new Date();

      jest.spyOn(apiKeyRepository, "findOne").mockResolvedValue({
        isActive: true,
        startDate: currentDate.setDate(currentDate.getDate() + 1),
        endDate: currentDate.setDate(currentDate.getDate() + 5),
      });
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "abc:xyz");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5023);
      expect(body.message).toMatch(/Api Key not active yet/i);
    });

    it("should return error when expired", async () => {
      const currentDate = new Date();

      jest.spyOn(apiKeyRepository, "findOne").mockResolvedValue({
        isActive: true,
        startDate: currentDate.setDate(currentDate.getDate() - 5),
        endDate: currentDate.setDate(currentDate.getDate() - 1),
      });
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "abc:xyz");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5024);
      expect(body.message).toMatch(/API Key expired/i);
    });

    it("should error when invalid compare hash", async () => {
      const currentDate = new Date();

      jest.spyOn(apiKeyRepository, "findOne").mockResolvedValue({
        isActive: true,
        startDate: currentDate.setDate(currentDate.getDate() - 5),
        endDate: currentDate.setDate(currentDate.getDate() + 10),
      });
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "abc:xyz");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(5025);
      expect(body.message).toMatch(/Invalid API Key/i);
    });
    it("should have apiKey in req header when success validate x-api-key", async () => {
      const currentDate = new Date();

      jest.spyOn(apiKeyRepository, "findOne").mockResolvedValue({
        _id: 1,
        name: "test",
        type: ENUM_API_KEY_TYPE.PUBLIC,
        key: "abc",
        hash: "1282c93310045f22506caec3c92f2680c6cb35118b3108629ad860117c562168",
        isActive: true,
        startDate: currentDate.setDate(currentDate.getDate() - 5),
        endDate: currentDate.setDate(currentDate.getDate() + 10),
      });
      const { body } = await request(app.getHttpServer())
        .get("/hello/api-key")
        .set("x-api-key", "abc:xyz");

      expect(body).toBeDefined();
      expect(body.statusCode).toBe(200);
      expect(body.message).toMatch(/This is test endpoint service/i);
    });
  });
});
