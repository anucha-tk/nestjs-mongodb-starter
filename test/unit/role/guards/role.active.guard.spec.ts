import { createMock } from "@golevelup/ts-jest";
import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleActiveGuard } from "src/modules/role/guards/role.active.guard";
import { RoleDoc } from "src/modules/role/repository/entities/role.entity";

describe("RoleActiveGuard", () => {
  let reflector: Reflector;
  let roleActiveGuard: RoleActiveGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    roleActiveGuard = new RoleActiveGuard(reflector);
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if not required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {};
      },
    } as any);

    const result = await roleActiveGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it("should pass if active match required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([true]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __role: { isActive: true } as RoleDoc,
        };
      },
    } as any);

    const result = await roleActiveGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it("should throw BadRequestException if isActive not match required metadata", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([false]);
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __role: { isActive: true } as RoleDoc,
        };
      },
    } as any);

    await expect(roleActiveGuard.canActivate(mockContext)).rejects.toThrow(BadRequestException);
  });
});
