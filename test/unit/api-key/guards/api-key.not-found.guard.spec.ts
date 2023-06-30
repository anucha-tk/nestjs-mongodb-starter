import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext, NotFoundException } from "@nestjs/common";
import { ApiKeyNotFoundGuard } from "src/common/api-key/guards/api-key.not-found.guard";
import { ApiKeyEntity } from "src/common/api-key/repository/entities/api-key.entity";

describe("notfound", () => {
  let apiKeyNotFoundGuard: ApiKeyNotFoundGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    apiKeyNotFoundGuard = new ApiKeyNotFoundGuard();
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if have __apiKey on app request", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __apiKey: {} as ApiKeyEntity,
        };
      },
    } as any);

    const result = await apiKeyNotFoundGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it("should throw NotFoundException if not have __apiKey on app request", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {};
      },
    } as any);

    await expect(apiKeyNotFoundGuard.canActivate(mockContext)).rejects.toThrow(NotFoundException);
  });
});
