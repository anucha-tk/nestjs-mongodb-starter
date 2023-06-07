import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import request from "supertest";

describe("helmet", () => {
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

  it("should have helmet property on header", async () => {
    const { header } = await request(app.getHttpServer()).get("/hello");

    expect(header).toBeDefined();
    expect(header).toHaveProperty("X-Response-Time");
    expect(header).toHaveProperty("cross-origin-opener-policy");
    expect(header).toHaveProperty("cross-origin-resource-policy");
  });
});
