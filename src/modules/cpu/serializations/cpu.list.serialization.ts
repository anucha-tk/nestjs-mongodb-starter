import { ApiHideProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ENUM_CPU_VERTICAL_SEGMENT } from "../constants/cpu.enum.constant";
import { CPUGetSerialization } from "./cpu.get.serialization";

export class CPUListSerialization extends OmitType(CPUGetSerialization, [
  "verticalSegment",
  "packageSize",
  "memoryTypes",
  "maxMemorySize",
  "maxOfMemoryChannels",
  "createdAt",
  "updatedAt",
] as const) {
  @Exclude()
  readonly verticalSegment: ENUM_CPU_VERTICAL_SEGMENT;

  @Exclude()
  readonly packageSize: string;

  @Exclude()
  readonly memoryTypes: string;

  @Exclude()
  readonly maxMemorySize: number;

  @Exclude()
  readonly maxOfMemoryChannels: number;

  @ApiHideProperty()
  @Exclude()
  readonly createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: Date;
}
