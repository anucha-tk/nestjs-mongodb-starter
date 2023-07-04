import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext, NotFoundException } from "@nestjs/common";
import { RoleNotFoundGuard } from "src/modules/role/guards/role.not-found.guard";
import { RoleDoc } from "src/modules/role/repository/entities/role.entity";

describe("RoleNotFoundGuard", () => {
  let roleNotFoundGuard: RoleNotFoundGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    roleNotFoundGuard = new RoleNotFoundGuard();
    mockContext = createMock<ExecutionContext>();
  });
  it("should throw 404 when __role not found", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {};
      },
    } as any);

    await expect(roleNotFoundGuard.canActivate(mockContext)).rejects.toThrow(NotFoundException);
  });

  it("should pass if have __role on app request", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __role: {} as RoleDoc,
        };
      },
    } as any);

    const result = await roleNotFoundGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });
});
