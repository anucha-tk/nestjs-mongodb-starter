import { ExecutionContext, NotFoundException } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserRestoreGuard } from "src/modules/user/guards/user.restore.guard";

describe("UserRestoreGuard", () => {
  let userRestoreGuard: UserRestoreGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    userRestoreGuard = new UserRestoreGuard();
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if have __user.deleteAt on app request", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: {
            deletedAt: new Date(),
          } as UserDoc,
        };
      },
    } as any);

    const result = await userRestoreGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it("should throw NotFoundException if not have __user.deleteAt on app request", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __user: {},
        };
      },
    } as any);

    await expect(userRestoreGuard.canActivate(mockContext)).rejects.toThrow(NotFoundException);
  });
});
