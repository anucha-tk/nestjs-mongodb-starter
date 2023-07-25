import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";
import { ENUM_CPU_MARKET_STATUS, ENUM_CPU_VERTICAL_SEGMENT } from "../constants/cpu.enum.constant";

export class CPUImportDto {
  @ApiProperty({
    example: "Intel Core i3-1005G1 Processor",
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Type(() => String)
  readonly cpuName: string;

  @ApiProperty({
    example: faker.internet.url(),
    required: true,
    nullable: false,
  })
  @IsUrl()
  @MaxLength(200)
  @Type(() => String)
  readonly link: string;

  @ApiProperty({
    example: "10th Generation Intel Core i3 Processors",
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  @Type(() => String)
  readonly productCollection: string;

  @ApiProperty({
    example: "Products formerly Comet Lake",
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  readonly codeName: string;

  @ApiProperty({
    example: "intel",
    required: true,
    nullable: false,
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @Type(() => String)
  readonly brand: string;

  @ApiProperty({
    example: faker.helpers.arrayElement(Object.values(ENUM_CPU_VERTICAL_SEGMENT)),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(ENUM_CPU_VERTICAL_SEGMENT)
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @Type(() => String)
  readonly verticalSegment: ENUM_CPU_VERTICAL_SEGMENT;

  @ApiProperty({
    example: "i3-1005G1",
    required: true,
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  @Type(() => String)
  readonly processorNumber: string;

  @ApiProperty({
    description: "nm unit(nanometer)",
    example: faker.helpers.arrayElement(["7", "10", "14"]),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly lithography?: number;

  @ApiProperty({
    example: "Intel UHD Graphics P630",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => String)
  readonly processorGraphics?: string;

  @ApiProperty({
    description: "Base on Mhz",
    example: faker.number.int({ min: 100, max: 1000 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly graphicsBaseFrequency?: number;

  @ApiProperty({
    example: faker.number.float({ min: 50, max: 1000, precision: 0.01 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly price?: number;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 50 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly totalCores?: number;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 50 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly totalThreads?: number;

  @ApiProperty({
    example: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly maxTurboFrequency?: number;

  @ApiProperty({
    description: "Base on Ghz",
    example: faker.number.float({ min: 1, max: 10, precision: 0.01 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly processorBaseFrequency?: number;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 50 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly cache?: number;

  @ApiProperty({
    description: "Watt unit",
    example: faker.number.int({ min: 50, max: 500 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly tdp?: number;

  @ApiProperty({
    example: faker.helpers.arrayElement(Object.values(ENUM_CPU_MARKET_STATUS)),
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @IsEnum(ENUM_CPU_MARKET_STATUS)
  @Type(() => String)
  @Transform(({ value }) => value.toUpperCase())
  readonly marketingStatus?: ENUM_CPU_MARKET_STATUS;

  @ApiProperty({
    example: faker.date.anytime(),
    required: false,
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => {
    // convert timestamp to date
    // we cant' send date time is'n work, but timestamp is work
    const newDate = new Date(value * 1000);
    return newDate;
  })
  @Type(() => String)
  readonly launchDate?: Date;

  @ApiProperty({
    description: "GB unit",
    example: faker.number.int({ min: 500, max: 1500 }),
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  readonly maxMemorySize?: number;

  @ApiProperty({
    example: "DDR4-3200",
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly memoryTypes?: string;

  @ApiProperty({
    example: faker.number.int({ min: 1, max: 4 }),
    required: false,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly maxOfMemoryChannels?: number;

  @ApiProperty({
    description: "max temp cpu celsius",
    example: faker.number.int({ min: 1, max: 100 }),
    required: false,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  readonly tjunction?: number;

  @ApiProperty({
    example: "FCBGA1440",
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly socketsSupported?: string;

  @ApiProperty({
    example: "46mm x 24mm",
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly packageSize?: string;
}
