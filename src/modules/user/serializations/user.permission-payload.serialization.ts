import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import { ENUM_POLICY_SUBJECT } from "src/common/policy/constants/policy.enum.constant";

export class UserPayloadPermissionSerialization {
  @ApiProperty({
    required: true,
    nullable: false,
    enum: ENUM_POLICY_SUBJECT,
    example: faker.helpers.arrayElement(Object.values(ENUM_POLICY_SUBJECT)),
  })
  subject: ENUM_POLICY_SUBJECT;

  @ApiProperty({
    required: true,
    nullable: false,
    example: "1,3",
  })
  action: string;
}
