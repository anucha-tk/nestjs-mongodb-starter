import { faker } from "@faker-js/faker";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "src/common/auth/services/auth.service";
import { HelperModule } from "src/common/helper/helper.module";
import configs from "src/configs";

describe("auth service", () => {
  let authService: AuthService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((path: string) => {
      switch (path) {
        case "auth.accessToken.encryptKey":
          return "AKeyForTestingPurposes";
        case "auth.accessToken.encryptIv":
          return "AnIvForTestingPurposes";
        case "auth.payloadEncryption":
          return true;
        case "auth.prefixAuthorization":
          return "bearer";
      }
    }),
  };

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
      providers: [AuthService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPayloadEncryption", () => {
    it("should return getPayloadEncryption", async () => {
      const result = await authService.getPayloadEncryption();

      expect(result).toBeDefined();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("encryptAccessToken", () => {
    it("should return string decryptAccessToken", async () => {
      const payload = { name: "simple" };
      const encrypted = await authService.encryptAccessToken(payload);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe("string");
    });
  });

  describe("decryptAccessToken", () => {
    it("should return object decryptAccessToken", async () => {
      const payload = { name: "simple" };
      const encrypted = await authService.encryptAccessToken(payload);
      const result = await authService.decryptAccessToken({ data: encrypted });

      expect(result).toEqual({ name: "simple" });
    });
  });

  describe("createSalt", () => {
    it("should return salt", async () => {
      const result = await authService.createSalt(8);
      expect(result).toBeDefined();
    });
  });

  describe("createPassword", () => {
    it("should createPassword", async () => {
      const result = await authService.createPassword("123456");

      expect(result).toBeDefined();
      expect(result).toHaveProperty("passwordHash");
      expect(typeof result.passwordHash).toBe("string");
      expect(result).toHaveProperty("passwordExpired");
      expect(result.passwordExpired instanceof Date).toBeTruthy();
      expect(result).toHaveProperty("passwordCreated");
      expect(result.passwordCreated instanceof Date).toBeTruthy();
      expect(result).toHaveProperty("salt");
      expect(typeof result.salt).toBe("string");
    });
  });

  describe("validateUser", () => {
    it("should return false when valid validateUser", async () => {
      const password = "123456";
      const passwordHash = faker.string.alphanumeric();
      const result = await authService.validateUser(password, passwordHash);
      expect(result).toBeFalsy();
    });
    it("should return true when valid validateUser", async () => {
      const password = "123456";
      const { passwordHash } = await authService.createPassword(password);
      const result = await authService.validateUser(password, passwordHash);
      expect(result).toBeTruthy();
    });
  });

  describe("getTokenType", () => {
    it("should return string tokenType", async () => {
      const result = await authService.getTokenType();
      expect(result).toBe("bearer");
    });
  });
});
