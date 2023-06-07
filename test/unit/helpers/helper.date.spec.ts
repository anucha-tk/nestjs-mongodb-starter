import { Test, TestingModule } from "@nestjs/testing";
import { HelperDateService } from "src/common/helper/services/helper.date.service";

describe("helper date service", () => {
  let helperDateService: HelperDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperDateService],
    }).compile();

    helperDateService = module.get<HelperDateService>(HelperDateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("format", () => {
    const date = new Date("2023-06-07");
    const dateFormat = helperDateService.format(date);
    expect(dateFormat).toBe("2023-06-07");
  });
  describe("timestamp", () => {
    it("timestamp with empty", () => {
      const timestamp = helperDateService.timestamp();

      expect(typeof timestamp).toBe("number");
    });

    it("timestamp with date", () => {
      const date = new Date("2023-06-07");
      const timestamp = helperDateService.timestamp(date);

      expect(typeof timestamp).toBe("number");
    });

    it("timestamp with startOfDay", () => {
      const date = new Date("2023-06-07");
      const timestamp = helperDateService.timestamp(date, { startOfDay: true });

      expect(typeof timestamp).toBe("number");
    });
  });
});
