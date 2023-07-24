import { ExecutionContext, NotFoundException } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { CPUNotFoundGuard } from "src/modules/cpu/guards/cpu.not-found.guard";

describe("CPUNotFoundGuard", () => {
  let cPUNotFoundGuard: CPUNotFoundGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    cPUNotFoundGuard = new CPUNotFoundGuard();
    mockContext = createMock<ExecutionContext>();
  });

  it("should throw NotFoundException if not have __cpu on app request", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __cpu: null,
        };
      },
    } as any);

    await expect(cPUNotFoundGuard.canActivate(mockContext)).rejects.toThrow(NotFoundException);
  });

  it("should pass if have __cpu on app request", async () => {
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return {
          __cpu: {},
        };
      },
    } as any);

    const result = await cPUNotFoundGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });
});
