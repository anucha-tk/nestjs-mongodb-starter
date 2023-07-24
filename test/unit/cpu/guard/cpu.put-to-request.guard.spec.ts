import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { CPUPutToRequestGuard } from "src/modules/cpu/guards/cpu.put-to-request.guard";
import { CPUService } from "src/modules/cpu/services/cpu.service";

describe("CPUPutToRequestGuard", () => {
  let reflector: Reflector;
  let cPUPutToRequestGuard: CPUPutToRequestGuard;
  let mockContext: ExecutionContext;
  let cpuService: CPUService;
  const mockId = faker.string.uuid();
  const cPUDoc = {
    _id: mockId,
  };

  beforeAll(async () => {
    reflector = new Reflector();
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CPUService,
          useValue: {
            findOneById: jest.fn().mockImplementation((id) => {
              if (id === mockId) {
                return cPUDoc;
              } else {
                return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    cpuService = modRef.get<CPUService>(CPUService);
    cPUPutToRequestGuard = new CPUPutToRequestGuard(cpuService, reflector);
    mockContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return request.__cpu equal undefined when cpu not exist", async () => {
    const mockRequest = {
      params: {
        cpu: faker.string.uuid(),
      },
      __cpu: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue({});
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await cPUPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__cpu).toEqual(undefined);
  });

  it("should return request.__cpu equal cPUDoc when cpu exist", async () => {
    const mockRequest = {
      params: {
        cpu: mockId,
      },
      __cpu: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue({});
    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await cPUPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__cpu).toEqual(cPUDoc);
  });
});
