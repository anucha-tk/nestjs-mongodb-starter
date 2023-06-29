import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { ENUM_API_KEY_TYPE } from "src/common/api-key/constants/api-key.enum.constant";
import { ApiKeyEntity } from "src/common/api-key/repository/entities/api-key.entity";
import { ApiKeyRepository } from "src/common/api-key/repository/repositories/api-key.repository";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { HelperModule } from "src/common/helper/helper.module";
import configs from "src/configs";

describe("api-key service", () => {
  let apiKeyService: ApiKeyService;
  let apiKeyRepository: ApiKeyRepository;
  // const apiKeyId = faker.string.uuid();
  // const apiKeyEntityDoc = new mongoose.Mongoose().model(ApiKeyDatabaseName, ApiKeySchema);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: configs,
          isGlobal: true,
          cache: true,
          envFilePath: [".env"],
          expandVariables: true,
        }),
        HelperModule,
      ],
      providers: [
        ApiKeyService,
        {
          provide: ApiKeyRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1 }),
            findOne: jest.fn().mockResolvedValue({ id: 1, name: faker.word.words() }),
            findAll: jest.fn().mockResolvedValue([new ApiKeyEntity(), new ApiKeyEntity()]),
            getTotal: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    apiKeyService = module.get<ApiKeyService>(ApiKeyService);
    apiKeyRepository = module.get<ApiKeyRepository>(ApiKeyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findOneByActiveKey", () => {
    it("should return api-key doc when findOne", async () => {
      const apiKey = await apiKeyService.findOneByActiveKey("abc");

      expect(apiKey).toBeDefined();
    });
  });

  describe("createKey", () => {
    it("should return key", async () => {
      const apiKey = await apiKeyService.createKey();

      expect(apiKey).toHaveLength(25);
      expect(apiKey).toMatch(/_/);
      expect(typeof apiKey).toBe("string");
    });
  });

  describe("createSecret", () => {
    it("should return secret key", async () => {
      const secretKey = await apiKeyService.createSecret();

      expect(secretKey).toHaveLength(35);
      expect(typeof secretKey).toBe("string");
    });
  });

  describe("createHashApiKey", () => {
    it("should return string of hash", async () => {
      const [key, secret] = await Promise.all([
        apiKeyService.createKey(),
        apiKeyService.createSecret(),
      ]);
      const hash = await apiKeyService.createHashApiKey(key, secret);

      expect(hash).toBeDefined();
    });
  });

  describe("create", () => {
    it("should return doc and secret when create api-key", async () => {
      const name = faker.word.words();
      const apiKey = await apiKeyService.create({
        name,
        type: ENUM_API_KEY_TYPE.PUBLIC,
      });

      expect(apiKey.doc).toBeDefined();
      expect(apiKey.secret).toBeDefined();
    });
  });

  describe("findAll", () => {
    it("should return apiKeys", async () => {
      const result = await apiKeyService.findAll();
      expect(apiKeyRepository.findAll).toBeCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe("getTotal", () => {
    it("should getTotal equal 1", async () => {
      const result = await apiKeyService.getTotal();
      expect(result).toBe(1);
      expect(apiKeyRepository.getTotal).toBeCalled();
    });
  });
});
