import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { HelperEncryptionService } from "src/common/helper/services/helper.encrypt.service";

describe("helper encryption service", () => {
  let helperEncryptionService: HelperEncryptionService;
  const mockJwtService = {
    sign: jest.fn().mockReturnValue("mockedToken"),
    decode: jest.fn().mockReturnValue({ text: "mockedData" }),
    verify: jest.fn().mockImplementation((token: string) => {
      if (token === "AValidJwtTokenForTestingPurposes") return true;
      throw Error();
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperEncryptionService, { provide: JwtService, useValue: mockJwtService }],
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

  describe("jwtEncrypt", () => {
    it("should return string when jwtEncrypt", () => {
      const payload = { name: "abc" };
      const result = helperEncryptionService.jwtEncrypt(payload, {
        expiredIn: "1h",
        audience: "",
        issuer: "",
        subject: "",
        secretKey: "",
      });
      expect(result).toBeDefined();
      expect(result).toBe("mockedToken");
    });
  });
});
