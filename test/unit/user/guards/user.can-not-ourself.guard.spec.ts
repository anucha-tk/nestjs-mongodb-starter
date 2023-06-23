import { ExecutionContext, NotFoundException } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserCanNotOurSelfGuard } from "src/modules/user/guards/user.can-not-ourself.guard";
import { faker } from "@faker-js/faker";

describe("UserCanNotOurSelfGuard", () => {
  let userCanNotOurSelfGuard: UserCanNotOurSelfGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    userCanNotOurSelfGuard = new UserCanNotOurSelfGuard();
    mockContext = createMock<ExecutionContext>();
  });

  it("should pass if user auth not equal __user", async () => {
    const _id = faker.string.uuid();
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return [
          {
            __user: { _id } as UserDoc,
          },
          {
            user: { _id: faker.string.uuid() } as UserDoc,
          },
        ];
      },
    } as any);

    const result = await userCanNotOurSelfGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it("should throw NotFoundException if user auth equal __user", async () => {
    const _id = faker.string.uuid();
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: () => {
        return [
          {
            __user: { _id } as UserDoc,
          },
          {
            user: { _id } as UserDoc,
          },
        ];
      },
    } as any);
    await expect(userCanNotOurSelfGuard.canActivate(mockContext)).rejects.toThrow(
      NotFoundException,
    );
  });
});
