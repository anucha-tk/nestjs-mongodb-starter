import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";
import { CPUDatabaseName, CPUDoc, CPUSchema } from "src/modules/cpu/repository/entities/cpu.entity";
import { CPURepository } from "src/modules/cpu/repository/repositories/cpu.repository";
import { CPUService } from "src/modules/cpu/services/cpu.service";

describe("cpu service", () => {
  let cPuService: CPUService;
  let cPURepository: CPURepository;
  const cPUKeyId = faker.string.uuid();
  const cPUKeyEntityDoc = new mongoose.Mongoose().model(CPUDatabaseName, CPUSchema);

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        CPUService,
        {
          provide: CPURepository,
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([
                new cPUKeyEntityDoc(),
                new cPUKeyEntityDoc(),
                new cPUKeyEntityDoc(),
              ]),
            findOneById: jest.fn().mockImplementation((_id) => {
              const find = new cPUKeyEntityDoc();
              find._id = cPUKeyId;
              if (_id) {
                find._id = _id;
              }
              return find;
            }),
          },
        },
      ],
    }).compile();

    cPuService = modRef.get<CPUService>(CPUService);
    cPURepository = modRef.get<CPURepository>(CPURepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return 3 cpu", async () => {
      const result = await cPuService.findAll();
      expect(result).toHaveLength(3);
      expect(result[0] instanceof cPUKeyEntityDoc).toBeTruthy();
      expect(cPURepository.findAll).toBeCalled();
      expect(cPURepository.findAll).toBeCalledWith(undefined, {});
    });
  });

  describe("findOneById", () => {
    it("should return single cpu when find by id", async () => {
      const result = await cPuService.findOneById<CPUDoc>("abc", {});
      expect(result._id).toBe("abc");
      expect(result instanceof cPUKeyEntityDoc).toBeTruthy();
      expect(cPURepository.findOneById).toBeCalled();
      expect(cPURepository.findOneById).toBeCalledWith("abc", {});
    });
  });
});
