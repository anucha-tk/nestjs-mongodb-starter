import { ApiProperty } from "@nestjs/swagger";
import { RoleInActiveSerialization } from "./role.inActive.serialization";

export class RoleActiveSerialization extends RoleInActiveSerialization {
  @ApiProperty({
    description: "Active flag of role",
    example: true,
    required: true,
    nullable: false,
  })
  readonly isActive: boolean;
}
