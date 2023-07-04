import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { RolePutToRequestGuard } from "src/modules/role/guards/role.put-to-request.guard";
import { RoleService } from "src/modules/role/services/role.service";
import { RoleRepository } from "src/modules/role/repository/repositories/role.repository";

describe("RolePutToRequestGuard", () => {
  let rolePutToRequestGuard: RolePutToRequestGuard;
  let mockContext: ExecutionContext;
  let roleService: RoleService;
  const mockId = faker.string.uuid();
  const roleDoc = {
    _id: mockId,
    name: faker.word.words(),
  };

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RoleService,
          useValue: {
            findOneById: jest.fn().mockImplementation((id) => {
              if (id === mockId) {
                return roleDoc;
              } else {
                return undefined;
              }
            }),
          },
        },
        {
          provide: RoleRepository,
          useValue: {
            findOneById: jest.fn().mockResolvedValue({ _id: mockId }),
          },
        },
      ],
    }).compile();

    roleService = modRef.get<RoleService>(RoleService);
    rolePutToRequestGuard = new RolePutToRequestGuard(roleService);
    mockContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return request.__role equal undefined", async () => {
    const mockRequest = {
      params: {
        role: faker.string.uuid(),
      },
      __role: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await rolePutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__role).toEqual(undefined);
  });
  it("should return request.__role equal roleDoc", async () => {
    const mockRequest = {
      params: {
        role: mockId,
      },
      __role: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await rolePutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__role).toEqual(roleDoc);
  });
});
