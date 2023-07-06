import { faker } from "@faker-js/faker";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";
import { RoleCreateDto } from "./role.create.dto";

/**
 * RoleUpdateDto.
 * @extends PartialType RoleCreateDto
 */
export class RoleUpdateDto extends PartialType(RoleCreateDto) {
  @ApiProperty({
    description: "Role active",
    required: false,
    example: faker.datatype.boolean(),
    nullable: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}
