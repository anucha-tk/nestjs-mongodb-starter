import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { HelperEncryptionService } from "src/common/helper/services/helper.encrypt.service";

describe("helper encryption service", () => {
  let helperEncryptionService: HelperEncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperEncryptionService],
    }).compile();

    helperEncryptionService = module.get<HelperEncryptionService>(HelperEncryptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("aes256Encrypt", () => {
    it("should return string encrypt", async () => {
      const payload = { name: faker.person.firstName() };
      const result = helperEncryptionService.aes256Encrypt(payload, "abc", "xyz");

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("aes256Encrypt", () => {
    it("should return string encrypt", async () => {
      const payload = { name: "simple" };
      const encrypted = helperEncryptionService.aes256Encrypt(payload, "abc", "xyz");
      const result = helperEncryptionService.aes256Decrypt(encrypted, "abc", "xyz");

      expect(result).toBeDefined();
      expect(result).toEqual({ name: "simple" });
    });
  });
});
