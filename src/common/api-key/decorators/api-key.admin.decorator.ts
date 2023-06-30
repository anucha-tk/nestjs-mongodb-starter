import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiKeyNotFoundGuard } from "../guards/api-key.not-found.guard";
import { ApiKeyPutToRequestGuard } from "../guards/api-key.put-to-request.guard";

/**
 * ApiKeyAdminGetGuard Decorator
 * Guards
 * - ApiKeyPutToRequestGuard - find apikey from params then put to `request.__apiKey`
 * - ApiKeyNotFoundGuard - check `__apiKey` is exists
 */
export function ApiKeyAdminGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard));
}
