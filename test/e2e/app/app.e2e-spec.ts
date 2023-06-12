import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import request from "supertest";

describe("app", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
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
});
