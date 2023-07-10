import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class UserChangePasswordDto {
  @ApiProperty({
    description: "new string password, newPassword can't same with oldPassword",
    example: faker.string.alphanumeric(5).toLowerCase(),
    required: true,
    nullable: false,
  })
  @IsNotEmpty()
  @MaxLength(50)
  readonly newPassword: string;

  @ApiProperty({
    description: "old string password",
    example: faker.string.alphanumeric(5).toLowerCase(),
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;
}
