import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { UserPutToRequestGuard } from "src/modules/user/guards/user.put-to-request.guard";
import { UserService } from "src/modules/user/services/user.service";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRepository } from "src/modules/user/repository/repositories/user.repository";
import { HelperDateService } from "src/common/helper/services/helper.date.service";

describe("UserPutToRequestGuard", () => {
  let userPutToRequestGuard: UserPutToRequestGuard;
  let mockContext: ExecutionContext;
  let userService: UserService;
  const mockId = faker.string.uuid();
  const userDoc = {
    _id: mockId,
    name: faker.person.firstName(),
  };

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn().mockImplementation((id) => {
              if (id === mockId) {
                return userDoc;
              } else {
                return undefined;
              }
            }),
          },
        },
        HelperDateService,
        {
          provide: UserRepository,
          useValue: {
            findOneById: jest.fn().mockResolvedValue({ _id: mockId }),
          },
        },
      ],
    }).compile();

    userService = modRef.get<UserService>(UserService);
    userPutToRequestGuard = new UserPutToRequestGuard(userService);
    mockContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return request.__user equal undefined", async () => {
    const mockRequest = {
      params: {
        user: faker.string.uuid(),
      },
      __user: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await userPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__user).toEqual(undefined);
  });
  it("should return request.__user equal userDoc", async () => {
    const mockRequest = {
      params: {
        user: mockId,
      },
      __user: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await userPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__user).toEqual(userDoc);
  });
});
