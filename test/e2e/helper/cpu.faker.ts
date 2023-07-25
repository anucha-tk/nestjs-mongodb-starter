import { faker } from "@faker-js/faker";
import {
  ENUM_CPU_MARKET_STATUS,
  ENUM_CPU_VERTICAL_SEGMENT,
} from "src/modules/cpu/constants/cpu.enum.constant";
import { CPUCreateDto } from "src/modules/cpu/dtos/cpu.create.dto";
import { CPUDoc } from "src/modules/cpu/repository/entities/cpu.entity";
import { CPUService } from "src/modules/cpu/services/cpu.service";

/**
 * CPUFaker for Mock Testing
 */
export class CPUFaker {
  constructor(private readonly cPUService: CPUService) {}

  public async create({
    cpuName,
    link,
    productCollection,
    codeName,
    verticalSegment,
    processorNumber,
    lithography,
    brand,
    marketingStatus,
  }: Partial<CPUCreateDto>): Promise<CPUDoc> {
    const cpu = `I5-${faker.number.int({ min: 5000, max: 6000 })}`;
    return this.cPUService.create({
      cpuName: cpuName ?? `Intel Core ${cpu} Processor`,
      link: link ?? faker.internet.url(),
      productCollection: productCollection ?? faker.lorem.words(2),
      codeName: codeName ?? faker.word.words(2),
      verticalSegment:
        verticalSegment ?? faker.helpers.arrayElement(Object.values(ENUM_CPU_VERTICAL_SEGMENT)),
      brand: brand ?? faker.helpers.arrayElement(["intel", "amd"]),
      processorNumber: processorNumber ?? cpu,
      lithography: lithography ?? faker.helpers.arrayElement([7, 14]),
      marketingStatus:
        marketingStatus ?? faker.helpers.arrayElement(Object.values(ENUM_CPU_MARKET_STATUS)),
    });
  }
}
