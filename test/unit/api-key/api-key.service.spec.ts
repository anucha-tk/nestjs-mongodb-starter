import { faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";
import { ENUM_API_KEY_TYPE } from "src/common/api-key/constants/api-key.enum.constant";
import {
  ApiKeyDatabaseName,
  ApiKeyEntity,
  ApiKeySchema,
} from "src/common/api-key/repository/entities/api-key.entity";
import { ApiKeyRepository } from "src/common/api-key/repository/repositories/api-key.repository";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { HelperModule } from "src/common/helper/helper.module";
import configs from "src/configs";

describe("api-key service", () => {
  let apiKeyService: ApiKeyService;
  let apiKeyRepository: ApiKeyRepository;
  const apiKeyId = faker.string.uuid();
  const apiKeyEntityDoc = new mongoose.Mongoose().model(ApiKeyDatabaseName, ApiKeySchema);

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
            findOne: jest.fn().mockImplementation(({ key }) => {
              const find = new apiKeyEntityDoc();
              find._id = apiKeyId;

              if (key) {
                find.key = key;
              }

              return find;
            }),
            findOneById: jest.fn().mockImplementation((id) => {
              const find = new apiKeyEntityDoc();
              find._id = id;

              return find;
            }),
            findAll: jest.fn().mockResolvedValue([new ApiKeyEntity(), new ApiKeyEntity()]),
            getTotal: jest.fn().mockResolvedValue(1),
            save: jest.fn().mockImplementation(({ name, key, startDate, endDate, isActive }) => {
              const find = new apiKeyEntityDoc();
              find._id = apiKeyId;
              find.name = name;
              find.key = key;
              find.isActive = isActive;
              find.startDate = startDate ? new Date(startDate) : undefined;
              find.endDate = endDate ? new Date(endDate) : undefined;

              return find;
            }),
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

  describe("findOneById", () => {
    it("should return apiKey", async () => {
      const id = faker.string.uuid();
      const result = await apiKeyService.findOneById(id);

      expect(result).toBeDefined();
      expect(result._id).toBe(id);
      expect(apiKeyRepository.findOneById).toBeCalled();
    });
  });

  describe("reset", () => {
    it("should reset api0key hash", async () => {
      const secret = faker.string.alphanumeric(5);
      const result = await apiKeyService.reset(new apiKeyEntityDoc(), secret);

      expect(result).toBeDefined();
      expect(apiKeyRepository.save).toBeCalled();
    });
  });

  describe("active", () => {
    it("should return isActive true", async () => {
      const result = await apiKeyService.active(new apiKeyEntityDoc());
      expect(result).toBeDefined();
      expect(result.isActive).toBeTruthy();
      expect(apiKeyRepository.save).toBeCalled();
    });
  });

  describe("inActive", () => {
    it("should return isActive false", async () => {
      const result = await apiKeyService.inActive(new apiKeyEntityDoc());
      expect(result).toBeDefined();
      expect(result.isActive).toBeFalsy();
      expect(apiKeyRepository.save).toBeCalled();
    });
  });
});
