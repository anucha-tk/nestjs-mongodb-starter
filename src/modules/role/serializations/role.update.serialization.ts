import { ApiHideProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { RoleGetSerialization } from "./role.get.serialization";

export class RoleUpdateSerialization extends OmitType(RoleGetSerialization, [
  "createdAt",
  "updatedAt",
]) {
  @ApiHideProperty()
  @Exclude()
  readonly createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: Date;
}
