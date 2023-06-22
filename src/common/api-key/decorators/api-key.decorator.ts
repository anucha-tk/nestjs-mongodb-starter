import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { API_KEY_TYPE_META_KEY } from "../constants/api-key.constant";
import { ENUM_API_KEY_TYPE } from "../constants/api-key.enum.constant";
import { ApiKeyPayloadTypeGuard } from "../guards/payload/api-key.payload.type.guard";
import { ApiKeyXApiKeyGuard } from "../guards/x-api-key/api-key.x-api-key.guard";

export function ApiKeyPublicProtected() {
  return applyDecorators(
    UseGuards(ApiKeyXApiKeyGuard, ApiKeyPayloadTypeGuard),
    SetMetadata(API_KEY_TYPE_META_KEY, [ENUM_API_KEY_TYPE.PUBLIC]),
  );
}
