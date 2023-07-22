import { faker } from "@faker-js/faker";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ResponseIdSerialization } from "src/common/response/serializations/response.id.serialization";
import { ENUM_CPU_MARKET_STATUS, ENUM_CPU_VERTICAL_SEGMENT } from "../constants/cpu.enum.constant";
export class CPUGetSerialization extends ResponseIdSerialization {
  @ApiProperty({
    example: "Intel Core i3-8350K Processor",
    required: true,
    nullable: false,
  })
  readonly cpuName: string;

  @ApiProperty({
    example: faker.internet.url(),
    required: true,
    nullable: false,
  })
  readonly link: string;

  @ApiProperty({
    example: "Intel Core X-series Processors",
    required: true,
    nullable: false,
  })
  readonly productCollection: string;

  @ApiProperty({
    example: "Sandy Bridge E",
    required: true,
    nullable: false,
  })
  readonly codeName: string;

  @ApiProperty({
    example: faker.helpers.arrayElement(Object.values(ENUM_CPU_VERTICAL_SEGMENT)),
    required: true,
    nullable: false,
  })
  readonly verticalSegment: ENUM_CPU_VERTICAL_SEGMENT;

  @ApiProperty({
    example: faker.helpers.arrayElement(["intel", "amd"]),
    required: true,
    nullable: false,
  })
  readonly brand: string;

  @ApiProperty({
    example: "i7-3960X",
    required: true,
    nullable: false,
  })
  readonly processorNumber: string;

  @ApiProperty({
    example: faker.helpers.arrayElement(["7", "14"]),
    required: false,
    nullable: true,
  })
  readonly lithography?: number;

  @ApiProperty({
    example: faker.number.float({ min: 50, max: 1000, precision: 0.01 }),
    required: false,
    nullable: true,
  })
  readonly price?: number;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 50 }),
    required: false,
    nullable: true,
  })
  readonly totalCores?: number;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 50 }),
    required: false,
    nullable: true,
  })
  readonly totalThreads?: number;

  @ApiProperty({
    example: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
    required: false,
    nullable: true,
  })
  readonly maxTurboFrequency?: number;

  @ApiProperty({
    example: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
    required: false,
    nullable: true,
  })
  readonly processorBaseFrequency?: number;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 50 }),
    required: false,
    nullable: true,
  })
  readonly cache?: number;

  @ApiProperty({
    description: "Watt unit",
    example: faker.number.int({ min: 50, max: 500 }),
    required: false,
    nullable: true,
  })
  readonly tdp?: number;

  @ApiProperty({
    example: faker.helpers.arrayElement(Object.values(ENUM_CPU_MARKET_STATUS)),
    required: false,
    nullable: true,
  })
  readonly marketingStatus: ENUM_CPU_MARKET_STATUS;

  @ApiProperty({
    example: faker.date.anytime(),
    required: false,
    nullable: true,
  })
  readonly launchDate?: Date;

  @ApiProperty({
    description: "GB unit",
    example: faker.number.int({ min: 500, max: 1500 }),
    required: false,
    nullable: true,
  })
  readonly maxMemorySize?: number;

  @ApiProperty({
    example: "DDR4-3200",
    required: false,
    nullable: true,
  })
  readonly memoryTypes?: string;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 4 }),
    required: false,
    nullable: true,
  })
  readonly maxOfMemoryChannels?: number;

  @ApiProperty({
    example: "FCBGA1440",
    required: false,
    nullable: true,
  })
  readonly socketsSupported?: string;

  @ApiProperty({
    example: "46mm x 24mm",
    required: false,
    nullable: true,
  })
  readonly packageSize?: string;

  @ApiProperty({
    description: "Date created at",
    example: faker.date.recent(),
    required: true,
    nullable: false,
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: "Date updated at",
    example: faker.date.recent(),
    required: true,
    nullable: false,
  })
  readonly updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly deletedAt?: Date;
}
