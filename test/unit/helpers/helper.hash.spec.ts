import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { HelperHashService } from "src/common/helper/services/helper.hash.service";

describe("HelperHashService", () => {
  let helperHashService: HelperHashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperHashService],
    }).compile();

    helperHashService = module.get<HelperHashService>(HelperHashService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("randomSalt", () => {
    it("should return string and call with length", () => {
      jest.spyOn(helperHashService, "randomSalt");
      const salt = helperHashService.randomSalt(8);

      expect(salt).toBeDefined();
      expect(helperHashService.randomSalt).toBeCalledWith(8);
    });
  });

  describe("bcrypt", () => {
    it("should return string", () => {
      const stringHash = helperHashService.bcrypt(
        faker.string.alphanumeric(10),
        helperHashService.randomSalt(10),
      );
      expect(typeof stringHash).toBe("string");
      expect(stringHash).toBeDefined();
    });
  });

  describe("bcryptCompare", () => {
    it("should return true when password and passwordHash is match", async () => {
      const password = faker.string.alphanumeric(8);
      const salt = helperHashService.randomSalt(8);
      const passwordHash = helperHashService.bcrypt(password, salt);
      const result = helperHashService.bcryptCompare(password, passwordHash);

      expect(result).toBeDefined();
      expect(result).toBeTruthy();
    });

    it("should return false when password and passwordHash is match", async () => {
      const password = faker.string.alphanumeric(8);
      const newPassword = faker.string.alphanumeric(8);
      const salt = helperHashService.randomSalt(8);
      const passwordHash = helperHashService.bcrypt(password, salt);
      const result = helperHashService.bcryptCompare(newPassword, passwordHash);

      expect(result).toBeDefined();
      expect(result).toBeFalsy();
    });
  });
});
