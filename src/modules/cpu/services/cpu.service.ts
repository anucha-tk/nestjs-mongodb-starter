import { Injectable } from "@nestjs/common";
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
} from "src/common/database/interfaces/database.interface";
import { CPUCreateDto } from "../dtos/cpu.create.dto";
import { CPUImportDto } from "../dtos/cpu.import.dto";
import { ICPUService } from "../interfaces/cpu.service.interface";
import { CPUDoc, CPUEntity } from "../repository/entities/cpu.entity";
import { CPURepository } from "../repository/repositories/cpu.repository";

@Injectable()
export class CPUService implements ICPUService {
  constructor(private readonly cpuRepository: CPURepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CPUEntity[]> {
    return this.cpuRepository.findAll<CPUEntity>(find, {
      ...options,
    });
  }

  async getTotal(find?: Record<string, any>, options?: IDatabaseGetTotalOptions): Promise<number> {
    return this.cpuRepository.getTotal(find, options);
  }

  async import(data: CPUImportDto[]): Promise<boolean> {
    const cpus: CPUEntity[] = data.map(
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
        const create: CPUEntity = new CPUEntity();
        create.cpuName = cpuName;
        create.link = link;
        create.productCollection = productCollection;
        create.codeName = codeName;
        create.verticalSegment = verticalSegment;
        create.brand = brand;
        create.processorNumber = processorNumber;
        create.lithography = lithography;
        create.processorGraphics = processorGraphics;
        create.graphicsBaseFrequency = graphicsBaseFrequency;
        create.price = price;
        create.totalCores = totalCores;
        create.totalThreads = totalThreads;
        create.maxTurboFrequency = maxTurboFrequency;
        create.processorBaseFrequency = processorBaseFrequency;
        create.cache = cache;
        create.tdp = tdp;
        create.marketingStatus = marketingStatus;
        create.launchDate = launchDate;
        create.maxMemorySize = maxMemorySize;
        create.memoryTypes = memoryTypes;
        create.maxOfMemoryChannels = maxOfMemoryChannels;
        create.tjunction = tjunction;
        create.socketsSupported = socketsSupported;
        create.packageSize = packageSize;

        return create;
      },
    );
    return this.cpuRepository.createMany<CPUEntity>(cpus);
  }

  async findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T> {
    return this.cpuRepository.findOneById<T>(_id, options);
  }

  async create({
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
  }: CPUCreateDto): Promise<CPUDoc> {
    const create: CPUEntity = new CPUEntity();

    create.cpuName = cpuName;
    create.link = link;
    create.productCollection = productCollection;
    create.codeName = codeName;
    create.verticalSegment = verticalSegment;
    create.brand = brand;
    create.processorNumber = processorNumber;
    create.lithography = lithography;
    create.processorGraphics = processorGraphics;
    create.graphicsBaseFrequency = graphicsBaseFrequency;
    create.price = price;
    create.totalCores = totalCores;
    create.totalThreads = totalThreads;
    create.maxTurboFrequency = maxTurboFrequency;
    create.processorBaseFrequency = processorBaseFrequency;
    create.cache = cache;
    create.tdp = tdp;
    create.marketingStatus = marketingStatus;
    create.launchDate = launchDate;
    create.maxMemorySize = maxMemorySize;
    create.memoryTypes = memoryTypes;
    create.maxOfMemoryChannels = maxOfMemoryChannels;
    create.tjunction = tjunction;
    create.socketsSupported = socketsSupported;
    create.packageSize = packageSize;

    return this.cpuRepository.create<CPUEntity>(create);
  }

  async deleteMany(find: Record<string, any>): Promise<boolean> {
    return this.cpuRepository.deleteMany(find);
  }
}
