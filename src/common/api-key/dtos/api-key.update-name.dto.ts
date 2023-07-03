import { PickType } from "@nestjs/swagger";
import { ApiKeyCreateDto } from "./api-key.create.dto";

export class ApiKeyUpdateNameDto extends PickType(ApiKeyCreateDto, ["name"] as const) {}
