import { createMock } from "@golevelup/ts-jest";
import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserBlockedGuard } from "src/modules/user/guards/user.blocked.guard";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";

describe("UserBlockedGuard", () => {
  let reflector: Reflector;
  let userBlockedGuard: UserBlockedGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    userBlockedGuard = new UserBlockedGuard(reflector);
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if required metadata is not defined", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    const result = await userBlockedGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });
  it("should pass if user is blocked and required metadata matches", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([true]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: {
            blocked: true,
          } as UserDoc,
        };
      },
    } as any);

    const result = await userBlockedGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it("should throw BadRequestException if user is not active", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([true]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: {
            isActive: false,
          } as UserDoc,
        };
      },
    } as any);

    await expect(userBlockedGuard.canActivate(mockContext)).rejects.toThrow(BadRequestException);
  });
});
