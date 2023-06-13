import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app/app.module";
import { ENUM_API_KEY_TYPE } from "src/common/api-key/constants/api-key.enum.constant";
import { ApiKeyRepository } from "src/common/api-key/repository/repositories/api-key.repository";
import request from "supertest";

describe("app language", () => {
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

  describe("/hello/api-key", () => {
    it("should return thai language", async () => {
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
        .set("x-api-key", "abc:xyz")
        .set("x-custom-lang", "th");

      expect(body.message).toMatch(/นี่คือบริการปลายทางทดสอบด้วยเอพีไอ/);
    });
  });
});
