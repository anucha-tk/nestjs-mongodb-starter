import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import request from "supertest";

describe.skip("ttl", () => {
  let app: NestApplication;

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

  it("should be rate limited to 10 requests per minute", async () => {
    const promises = [];

    // Send 11 requests in quick succession
    for (let i = 0; i < 11; i++) {
      promises.push(request(app.getHttpServer()).get("/hello"));
    }

    // Wait for all requests to complete
    const responses = await Promise.all(promises);

    // The first 10 requests should be successful
    for (let i = 0; i < 10; i++) {
      expect(responses[i].status).toEqual(200);
      expect(responses[i].body.message).toMatch(/this is test endpoint service/i);
    }

    // The 11th request should be rate limited
    expect(responses[10].status).toEqual(429);

    expect(responses[10].body.message).toMatch(/too many request/i);
  });

  it("should expire rate limit after 5 seconds", async () => {
    // Wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Send a request and expect it to be successful
    const response = await request(app.getHttpServer()).get("/hello");

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/this is test endpoint service/i);
  });
});
