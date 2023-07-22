import { ApiHideProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { CPUGetSerialization } from "./cpu.get.serialization";

export class CPUListSerialization extends OmitType(CPUGetSerialization, [
  "createdAt",
  "updatedAt",
] as const) {
  @ApiHideProperty()
  @Exclude()
  readonly createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: Date;
}
