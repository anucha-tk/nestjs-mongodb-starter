import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { ApiKeyExpiredGuard } from "src/common/api-key/guards/api-key.expired.guard";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { ApiKeyDoc } from "src/common/api-key/repository/entities/api-key.entity";

describe("ApiKeyPutToRequestGuard", () => {
  let apiKeyExpiredGuard: ApiKeyExpiredGuard;
  let mockContext: ExecutionContext;
  let helperDateService: HelperDateService;
  const mockId = faker.string.uuid();

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [HelperDateService],
    }).compile();

    helperDateService = modRef.get(HelperDateService);
    apiKeyExpiredGuard = new ApiKeyExpiredGuard(helperDateService);
    mockContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should pass if endDate greater than today", async () => {
    const mockRequest = {
      __apiKey: {
        _id: mockId,
        name: faker.word.words(),
        startDate: faker.date.recent(),
        endDate: faker.date.future(),
      } as ApiKeyDoc,
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await apiKeyExpiredGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it("should throw 400 BadRequestException if endDate less than today", async () => {
    const mockRequest = {
      __apiKey: {
        _id: mockId,
        name: faker.word.words(),
        startDate: faker.date.recent(),
        endDate: faker.date.past(),
      } as ApiKeyDoc,
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    await expect(apiKeyExpiredGuard.canActivate(mockContext)).rejects.toThrow(BadRequestException);
  });
});
