import { ApiHideProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { RoleGetSerialization } from "./role.get.serialization";

export class RoleUpdatePermissionsSerialization extends OmitType(RoleGetSerialization, [
  "name",
  "isActive",
  "description",
  "createdAt",
  "updatedAt",
]) {
  @ApiHideProperty()
  @Exclude()
  readonly name: string;

  @ApiHideProperty()
  @Exclude()
  readonly isActive: boolean;

  @ApiHideProperty()
  @Exclude()
  readonly description: string;

  @ApiHideProperty()
  @Exclude()
  readonly createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: Date;
}
