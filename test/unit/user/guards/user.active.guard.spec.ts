import { Reflector } from "@nestjs/core";
import { ExecutionContext, BadRequestException } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { UserActiveGuard } from "src/modules/user/guards/user.active.guard";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";

describe("UserActiveGuard", () => {
  let reflector: Reflector;
  let userActiveGuard: UserActiveGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    userActiveGuard = new UserActiveGuard(reflector);
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if required metadata is not defined", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    const result = await userActiveGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it("should pass if user is active and required metadata matches", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([true]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: {
            isActive: true,
          } as UserDoc,
        };
      },
    } as any);

    const result = await userActiveGuard.canActivate(mockContext);

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

    await expect(userActiveGuard.canActivate(mockContext)).rejects.toThrow(BadRequestException);
  });
});
