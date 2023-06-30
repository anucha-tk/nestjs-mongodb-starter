import { ExecutionContext } from "@nestjs/common";
import { createMock } from "@golevelup/ts-jest";
import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { ApiKeyPutToRequestGuard } from "src/common/api-key/guards/api-key.put-to-request.guard";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";
import { ApiKeyRepository } from "src/common/api-key/repository/repositories/api-key.repository";

describe("ApiKeyPutToRequestGuard", () => {
  let apiKeyPutToRequestGuard: ApiKeyPutToRequestGuard;
  let mockContext: ExecutionContext;
  let apiKeyService: ApiKeyService;
  const mockId = faker.string.uuid();
  const apiKeyDoc = {
    _id: mockId,
    name: faker.word.words(),
  };

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ApiKeyService,
          useValue: {
            findOneById: jest.fn().mockImplementation((id) => {
              if (id === mockId) {
                return apiKeyDoc;
              } else {
                return undefined;
              }
            }),
          },
        },
        {
          provide: ApiKeyRepository,
          useValue: {
            findOneById: jest.fn().mockResolvedValue(apiKeyDoc),
          },
        },
      ],
    }).compile();

    apiKeyService = modRef.get<ApiKeyService>(ApiKeyService);
    apiKeyPutToRequestGuard = new ApiKeyPutToRequestGuard(apiKeyService);
    mockContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return request.__apiKey equal undefined", async () => {
    const mockRequest = {
      params: {
        apiKey: faker.string.uuid(),
      },
      __apiKey: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await apiKeyPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__user).toEqual(undefined);
  });

  it("should return request.__apiKey equal apiKeyDoc", async () => {
    const mockRequest = {
      params: {
        apiKey: mockId,
      },
      __apiKey: undefined, // Initialize with undefined
    } as any;

    jest.spyOn(mockContext, "switchToHttp").mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    } as any);

    const result = await apiKeyPutToRequestGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.__apiKey).toEqual(apiKeyDoc);
  });
});
