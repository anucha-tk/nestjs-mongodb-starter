import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import request from "supertest";

describe("response time", () => {
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

  it("should have response time property on header", async () => {
    const { header } = await request(app.getHttpServer()).get("/hello");

    expect(header).toBeDefined();
    expect(header).toHaveProperty("x-response-time");
  });
});
