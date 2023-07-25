import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";
import { ENUM_CPU_VERTICAL_SEGMENT } from "src/modules/cpu/constants/cpu.enum.constant";
import { CPUCreateDto } from "src/modules/cpu/dtos/cpu.create.dto";
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
            create: jest
              .fn()
              .mockImplementation(
                ({
                  cpuName,
                  link,
                  productCollection,
                  codeName,
                  verticalSegment,
                  processorNumber,
                  processorGraphics,
                  graphicsBaseFrequency,
                  lithography,
                  price,
                  totalCores,
                  totalThreads,
                  maxTurboFrequency,
                  processorBaseFrequency,
                  cache,
                  tdp,
                  marketingStatus,
                  launchDate,
                  maxMemorySize,
                  memoryTypes,
                  maxOfMemoryChannels,
                  socketsSupported,
                  packageSize,
                  tjunction,
                  brand,
                }) => {
                  const find = new cPUKeyEntityDoc();
                  find._id = cPUKeyId;
                  find.cpuName = cpuName;
                  find.link = link;
                  find.productCollection = productCollection;
                  find.codeName = codeName;
                  find.verticalSegment = verticalSegment;
                  find.brand = brand;
                  find.processorNumber = processorNumber;
                  find.lithography = lithography;
                  find.processorGraphics = processorGraphics;
                  find.graphicsBaseFrequency = graphicsBaseFrequency;
                  find.price = price;
                  find.totalCores = totalCores;
                  find.totalThreads = totalThreads;
                  find.maxTurboFrequency = maxTurboFrequency;
                  find.processorBaseFrequency = processorBaseFrequency;
                  find.cache = cache;
                  find.tdp = tdp;
                  find.marketingStatus = marketingStatus;
                  find.launchDate = launchDate;
                  find.maxMemorySize = maxMemorySize;
                  find.memoryTypes = memoryTypes;
                  find.maxOfMemoryChannels = maxOfMemoryChannels;
                  find.tjunction = tjunction;
                  find.socketsSupported = socketsSupported;
                  find.packageSize = packageSize;

                  return find;
                },
              ),
            deleteMany: jest.fn().mockResolvedValue(true),
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

  describe("create", () => {
    it("should return cpuEntity when create", async () => {
      const data: CPUCreateDto = {
        cpuName: faker.word.words(2),
        link: faker.internet.url(),
        productCollection: "abc",
        codeName: "Comet Lake",
        brand: "amd",
        verticalSegment: ENUM_CPU_VERTICAL_SEGMENT.DESKTOP,
        processorNumber: "i5-5600",
      };
      const result = await cPuService.create(data);
      expect(result instanceof cPUKeyEntityDoc).toBeTruthy();
      expect(result.toObject()).toEqual({ _id: cPUKeyId, ...data });
    });
  });

  describe("deleteMany", () => {
    it("should return boolean when deleteMany", async () => {
      const result = await cPuService.deleteMany({});
      expect(typeof result).toBe("boolean");
    });
  });
});
