import { faker } from "@faker-js/faker";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { UserGetSerialization } from "./user.get.serialization";

export class UserCreateSerialization extends OmitType(UserGetSerialization, [
  "role",
  "passwordAttempt",
  "inactiveDate",
  "blockedDate",
]) {
  @ApiProperty({
    example: faker.string.uuid(),
    type: "string",
    required: true,
    nullable: false,
  })
  readonly role: string;

  @Exclude()
  readonly passwordAttempt: number;

  @Exclude()
  readonly inactiveDate: Date;

  @Exclude()
  readonly blockedDate: Date;
}
