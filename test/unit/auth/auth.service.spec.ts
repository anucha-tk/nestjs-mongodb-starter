import { faker } from "@faker-js/faker";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { ENUM_AUTH_LOGIN_WITH } from "src/common/auth/constants/auth.enum.constant";
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
        case "auth.accessToken.expirationTime":
          return "1h";
        case "auth.accessToken.secretKey":
          return "secretKey_accessToken";
        case "auth.subject":
          return "jwt_subject";
        case "auth.audience":
          return "jwt_audience";
        case "auth.issuer":
          return "jwt_issuer";
        case "auth.refreshToken.encryptKey":
          return "AKeyForTestingPurposes";
        case "auth.refreshToken.encryptIv":
          return "AnIvForTestingPurposes";
        case "auth.refreshToken.secretKey":
          return "secretKey_refreshToken";
        case "auth.refreshToken.expirationTime":
          return 60;
        case "auth.refreshToken.notBeforeExpirationTime":
          return 0;
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
    it("should return string encryptAccessToken", async () => {
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

  describe("getAccessTokenExpirationTime", () => {
    it("should return string expirationTime", async () => {
      const result = await authService.getAccessTokenExpirationTime();
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("createPayloadAccessToken", () => {
    it("should return payload access token", async () => {
      const payload = { name: "abc" };
      const result = await authService.createPayloadAccessToken(payload);
      expect(result).toBeDefined();
      expect(result).toEqual({ name: "abc" });
    });
  });

  describe("createPayloadRefreshToken", () => {
    it("should return payload refresh token", async () => {
      const result = await authService.createPayloadRefreshToken(faker.string.uuid(), {
        loginWith: ENUM_AUTH_LOGIN_WITH.LOCAL,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("loginWith", "LOCAL");
      expect(result).toHaveProperty("loginDate");
    });
  });

  describe("createAccessToken", () => {
    it("should return string hash access token when payload is string", async () => {
      const payload = "abc";
      const result = await authService.createAccessToken(payload);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
    it("should return string hash access token when payload is object", async () => {
      const payload = { name: "abc" };
      const result = await authService.createAccessToken(payload);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("encryptRefreshToken", () => {
    it("should return string when encryptRefreshToken", async () => {
      const payload = { name: "abc" };
      const result = await authService.encryptRefreshToken(payload);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("createRefreshToken", () => {
    it("should return string when createRefreshToken", async () => {
      const payload = { name: "xyz" };
      const result = await authService.createRefreshToken(payload);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });

  describe("checkPasswordExpired", () => {
    it("should return true when not expired", async () => {
      const soon = faker.date.soon();
      const result = await authService.checkPasswordExpired(soon);

      expect(result).toBeDefined();
      expect(result).toBeFalsy();
    });
    it("should return false when not expired", async () => {
      const recent = faker.date.recent();
      const result = await authService.checkPasswordExpired(recent);

      expect(result).toBeDefined();
      expect(result).toBeTruthy();
    });
  });

  describe("createPasswordRandom", () => {
    it("should return string", async () => {
      const result = await authService.createPasswordRandom();

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
    });
  });
});
