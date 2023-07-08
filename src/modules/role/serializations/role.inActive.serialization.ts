import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { ENUM_ROLE_TYPE } from "../constants/role.enum.constant";
import { RoleGetPermissionSerialization, RoleGetSerialization } from "./role.get.serialization";

export class RoleInActiveSerialization extends OmitType(RoleGetSerialization, [
  "name",
  "type",
  "permissions",
  "description",
  "createdAt",
  "updatedAt",
]) {
  @ApiHideProperty()
  @Exclude()
  readonly name: string;

  @ApiProperty({
    description: "Active flag of role",
    example: false,
    required: true,
    nullable: false,
  })
  readonly isActive: boolean;

  @ApiHideProperty()
  @Exclude()
  readonly type: ENUM_ROLE_TYPE;

  @ApiHideProperty()
  @Exclude()
  readonly permissions: RoleGetPermissionSerialization;

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
