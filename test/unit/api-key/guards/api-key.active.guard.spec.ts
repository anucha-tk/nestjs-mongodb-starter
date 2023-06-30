import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { Reflector } from "@nestjs/core";
import { ApiKeyActiveGuard } from "src/common/api-key/guards/api-key.active.guard";
import { ApiKeyDoc } from "src/common/api-key/repository/entities/api-key.entity";

describe("ApiKeyActiveGuard", () => {
  let reflector: Reflector;
  let apiKeyActiveGuard: ApiKeyActiveGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    apiKeyActiveGuard = new ApiKeyActiveGuard(reflector);
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if not required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {};
      },
    } as any);

    const result = await apiKeyActiveGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it("should pass if active match required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([true]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __apiKey: { isActive: true } as ApiKeyDoc,
        };
      },
    } as any);

    const result = await apiKeyActiveGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it("should throw BadRequestException if isActive not match required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([false]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __apiKey: { isActive: true } as ApiKeyDoc,
        };
      },
    } as any);

    await expect(apiKeyActiveGuard.canActivate(mockContext)).rejects.toThrow(BadRequestException);
  });
});
