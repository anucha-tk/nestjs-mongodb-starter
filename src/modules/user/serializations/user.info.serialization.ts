import { faker } from "@faker-js/faker";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ENUM_POLICY_SUBJECT } from "src/common/policy/constants/policy.enum.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { UserPayloadSerialization } from "./user.payload.serialization";
import { UserPayloadPermissionSerialization } from "./user.permission-payload.serialization";

export class UserInfoSerialization extends OmitType(UserPayloadSerialization, [
  "role",
  "permissions",
  "type",
]) {
  @ApiProperty({
    example: faker.string.uuid(),
    type: "string",
    required: true,
    nullable: false,
  })
  readonly role: string;

  @ApiProperty({
    example: ENUM_ROLE_TYPE.ADMIN,
    type: "string",
    enum: ENUM_ROLE_TYPE,
    required: true,
    nullable: false,
  })
  readonly type: ENUM_ROLE_TYPE;

  @ApiProperty({
    type: () => UserPayloadPermissionSerialization,
    isArray: true,
    required: true,
    nullable: false,
    example: [
      {
        subject: faker.helpers.arrayElement(Object.values(ENUM_POLICY_SUBJECT)),
        acton: "1,3",
      },
    ],
  })
  readonly permissions: UserPayloadPermissionSerialization;
}
