import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserInactivePermanentGuard } from "src/modules/user/guards/user.inactive-permanent.guard";
import { Reflector } from "@nestjs/core";

describe("UserInactivePermanentGuard", () => {
  let reflector: Reflector;
  let userInActivePermanentGuard: UserInactivePermanentGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    userInActivePermanentGuard = new UserInactivePermanentGuard(reflector);
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if not required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: { inactivePermanent: true } as UserDoc,
        };
      },
    } as any);

    const result = await userInActivePermanentGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it("should pass if inactivePermanent match required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([true]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: { inactivePermanent: true } as UserDoc,
        };
      },
    } as any);

    const result = await userInActivePermanentGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it("should throw Bad if inactivePermanent match required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([false]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: { inactivePermanent: true } as UserDoc,
        };
      },
    } as any);

    await expect(userInActivePermanentGuard.canActivate(mockContext)).rejects.toThrow(
      BadRequestException,
    );
  });
});
