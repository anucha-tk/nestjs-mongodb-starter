import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ResponsePagingSerialization } from "src/common/response/serializations/response.paging.serialization";
import request from "supertest";

describe("role e2e", () => {
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

  it("should return pagination response", async () => {
    const response = await request(app.getHttpServer()).get("/admin/role/list");
    const body: ResponsePagingSerialization = response.body;

    expect(body).toBeDefined();
    expect(body.statusCode).toBe(200);
    expect(body.message).toMatch(/Role list/i);
    expect(body._metadata).toBeDefined();
    expect(body.data).toBeDefined();
    expect(body._metadata.pagination.page).toBeDefined();
    expect(body._metadata.pagination.orderBy).toBeDefined();
    expect(body._metadata.pagination.search).toBeDefined();
  });
});
