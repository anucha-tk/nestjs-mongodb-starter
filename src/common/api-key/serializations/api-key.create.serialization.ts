import { faker } from "@faker-js/faker";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { ApiKeyGetSerialization } from "src/common/api-key/serializations/api-key.get.serialization";

export class ApiKeyCreateSerialization extends PickType(ApiKeyGetSerialization, [
  "key",
  "_id",
] as const) {
  @ApiProperty({
    description: "Secret key of ApiKey, only show at once",
    example: faker.string.alphanumeric(20),
    required: true,
  })
  secret: string;
}
