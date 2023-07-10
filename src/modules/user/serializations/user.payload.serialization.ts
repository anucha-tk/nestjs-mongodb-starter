import { faker } from "@faker-js/faker";
import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";
import { ENUM_POLICY_REQUEST_ACTION } from "src/common/policy/constants/policy.enum.constant";
import { IPolicyRule } from "src/common/policy/interfaces/policy.interface";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { ENUM_USER_SIGN_UP_FROM } from "../constants/user.enum.constant";
import { UserPayloadPermissionSerialization } from "./user.permission-payload.serialization";
import { UserProfileSerialization } from "./user.profile.serialization";

export class UserPayloadSerialization extends OmitType(UserProfileSerialization, [
  "role",
  "signUpDate",
  "createdAt",
  "updatedAt",
] as const) {
  @ApiProperty({
    example: faker.string.uuid(),
    type: "string",
    isArray: true,
    required: true,
    nullable: false,
  })
  @Transform(({ obj }) => `${obj.role._id}`)
  readonly role: string;

  @ApiProperty({
    example: ENUM_ROLE_TYPE.ADMIN,
    type: "string",
    enum: ENUM_ROLE_TYPE,
    required: true,
    nullable: false,
  })
  @Expose()
  @Transform(({ obj }) => obj.role.type)
  readonly type: ENUM_ROLE_TYPE;

  @ApiProperty({
    type: () => UserPayloadPermissionSerialization,
    isArray: true,
    required: true,
    nullable: false,
  })
  @Transform(({ obj }) => {
    return obj.role.permissions.map(({ action, subject }: IPolicyRule) => {
      const ac = action.map((l) => ENUM_POLICY_REQUEST_ACTION[l.toUpperCase()]);
      return {
        subject,
        action: ac.join(","),
      };
    });
  })
  @Expose()
  readonly permissions: UserPayloadPermissionSerialization[];

  @ApiHideProperty()
  @Exclude()
  readonly signUpDate: Date;

  @ApiHideProperty()
  @Exclude()
  readonly signUpFrom: ENUM_USER_SIGN_UP_FROM;

  @Exclude()
  readonly loginDate: Date;

  @ApiHideProperty()
  @Exclude()
  readonly createdAt: number;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: number;
}
