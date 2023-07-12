import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { RoleListSerialization } from "src/modules/role/serializations/role.list.serialization";
import { UserProfileSerialization } from "src/modules/user/serializations/user.profile.serialization";

export class UserListSerialization extends OmitType(UserProfileSerialization, [
  "signUpDate",
  "signUpFrom",
  "role",
] as const) {
  @ApiProperty({
    type: () => RoleListSerialization,
    required: true,
    nullable: false,
  })
  @Type(() => RoleListSerialization)
  readonly role: RoleListSerialization;

  @ApiHideProperty()
  @Exclude()
  readonly signUpDate: Date;
}
