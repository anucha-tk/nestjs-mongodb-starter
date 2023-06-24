import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { UserService } from "src/modules/user/services/user.service";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRepository } from "src/modules/user/repository/repositories/user.repository";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { UserPayloadPutToRequestGuard } from "src/modules/user/guards/payload/user.payload.put-to-request.guard";

describe("UserPayloadPutToRequestGuard", () => {
  let userPayloadPutToRequestGuard: UserPayloadPutToRequestGuard;
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
    userPayloadPutToRequestGuard = new UserPayloadPutToRequestGuard(userService);
    mockContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return request.__user equal undefined", async () => {
    const mockRequest = {
      user: {
        _id: faker.string.uuid(),
      },
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await userPayloadPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__user).toEqual(undefined);
  });
  it("should return request.__user equal userDoc", async () => {
    const mockRequest = {
      user: {
        _id: mockId,
      },
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await userPayloadPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__user).toEqual(userDoc);
  });
});
