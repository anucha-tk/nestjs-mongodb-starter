import { Test, TestingModule } from "@nestjs/testing";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { MinDateTodayConstraint } from "src/common/request/validations/request.min-date-today.validation";

describe("MinDateTodayConstraint", () => {
  let minDateTodayConstraint: MinDateTodayConstraint;
  let helperDateService: HelperDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinDateTodayConstraint, HelperDateService],
    }).compile();

    minDateTodayConstraint = module.get<MinDateTodayConstraint>(MinDateTodayConstraint);
    helperDateService = module.get<HelperDateService>(HelperDateService);
  });

  it("should return true when value is equal to today", () => {
    // Mock the helperDateService to return the current date
    const todayDate = new Date();
    jest.spyOn(helperDateService, "startOfDay").mockReturnValue(todayDate);

    // Create a test value equal to today's date
    const value = todayDate.toISOString();

    const isValid = minDateTodayConstraint.validate(value);

    expect(isValid).toBe(true);
  });

  it("should return true when value is greater than today", () => {
    // Mock the helperDateService to return a past date
    const todayDate = new Date();
    jest.spyOn(helperDateService, "startOfDay").mockReturnValue(todayDate);

    // Create a test value greater than today's date
    const value = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate() + 1,
    ).toISOString();

    const isValid = minDateTodayConstraint.validate(value);

    expect(isValid).toBe(true);
  });

  it("should return false when value is less than today", () => {
    // Mock the helperDateService to return a future date
    const todayDate = new Date();
    jest.spyOn(helperDateService, "startOfDay").mockReturnValue(todayDate);

    // Create a test value less than today's date
    const value = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate() - 1,
    ).toISOString();

    const isValid = minDateTodayConstraint.validate(value);

    expect(isValid).toBe(false);
  });
});
