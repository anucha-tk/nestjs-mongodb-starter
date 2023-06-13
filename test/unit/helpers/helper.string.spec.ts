import { Test, TestingModule } from "@nestjs/testing";
import { HelperStringService } from "src/common/helper/services/helper.string.service";

describe("helper string service", () => {
  let helperStringService: HelperStringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperStringService],
    }).compile();

    helperStringService = module.get<HelperStringService>(HelperStringService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("random", () => {
    it("should return /[A-Z]/ if safe", () => {
      const rString = helperStringService.random(10, { safe: true });

      expect(rString).toMatch(/[a-z]/);
    });
    it("should return /W/ if not safe", () => {
      const rString = helperStringService.random(10, { safe: false });

      expect(rString).toMatch(/[a-zA-z0-9]/);
    });
    it("should return valid length", () => {
      const rString = helperStringService.random(10);

      expect(rString).toHaveLength(10);
    });
    it("should return upperCase when use options upperCase", () => {
      const rString = helperStringService.random(10, { safe: false });

      expect(rString).toMatch(/[A-Z0-9]/);
    });
  });
});
