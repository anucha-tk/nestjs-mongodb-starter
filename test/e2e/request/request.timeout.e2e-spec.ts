import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_ERROR_STATUS_CODE_ERROR } from "src/common/error/constants/error.status-code.constant";
import request from "supertest";

describe("Timeout", () => {
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

  it("should return 408 Request timeout when add RequestTimeOut decorator", async () => {
    // Arrange
    const expectedErrorCode = "http.clientError.requestTimeOut";

    // Act
    const { body } = await request(app.getHttpServer()).get("/timeout");

    // Assert
    expect(body._error).toBe(expectedErrorCode);
    expect(body.message).toBe(expectedErrorCode);
    expect(body.statusCode).toBe(ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT);
    expect(body._metadata).toBeDefined();
  });
});
