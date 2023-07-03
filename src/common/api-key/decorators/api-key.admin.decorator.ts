import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { API_KEY_ACTIVE_META_KEY } from "../constants/api-key.constant";
import { ApiKeyActiveGuard } from "../guards/api-key.active.guard";
import { ApiKeyExpiredGuard } from "../guards/api-key.expired.guard";
import { ApiKeyNotFoundGuard } from "../guards/api-key.not-found.guard";
import { ApiKeyPutToRequestGuard } from "../guards/api-key.put-to-request.guard";

/**
 * ApiKeyAdminGetGuard Decorator
 *
 * Guards
 * - ApiKeyPutToRequestGuard - find apikey from params then put to `request.__apiKey`.
 * - ApiKeyNotFoundGuard - check `__apiKey` is exists.
 */
export function ApiKeyAdminGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard));
}

/**
 * ApiKeyAdminUpdateGuard Decorator.
 *
 * Guards
 * - ApiKeyPutToRequestGuard - find apikey from params then put to `request.__apiKey`.
 * - ApiKeyNotFoundGuard - check `__apiKey` is exists.
 * - ApiKeyActiveGuard - check `__apiKey.isActive` is includes `API_KEY_ACTIVE_META_KEY`.
 * - ApiKeyExpiredGuard - check `__apiKey.endDate` is greater today.
 */
export function ApiKeyAdminUpdateGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard, ApiKeyActiveGuard, ApiKeyExpiredGuard),
    SetMetadata(API_KEY_ACTIVE_META_KEY, [true]),
  );
}

/**
 * ApiKeyAdminUpdateActiveGuard Decorator.
 *
 * Guards
 * - ApiKeyPutToRequestGuard - find apikey from params then put to `request.__apiKey`.
 * - ApiKeyNotFoundGuard - check `__apiKey` is exists.
 * - ApiKeyActiveGuard - check `__apiKey.isActive` is includes `API_KEY_ACTIVE_META_KEY`.
 * - ApiKeyExpiredGuard - check `__apiKey.endDate` is greater today.
 */
export function ApiKeyAdminUpdateActiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard, ApiKeyActiveGuard, ApiKeyExpiredGuard),
    SetMetadata(API_KEY_ACTIVE_META_KEY, [false]),
  );
}

/**
 * ApiKeyAdminUpdateInActiveGuard Decorator.
 *
 * Guards
 * - ApiKeyPutToRequestGuard - find apikey from params then put to `request.__apiKey`.
 * - ApiKeyNotFoundGuard - check `__apiKey` is exists.
 * - ApiKeyActiveGuard - check `__apiKey.isActive` is includes `API_KEY_ACTIVE_META_KEY`.
 * - ApiKeyExpiredGuard - check `__apiKey.endDate` is greater today.
 */
export function ApiKeyAdminUpdateInActiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard, ApiKeyActiveGuard, ApiKeyExpiredGuard),
    SetMetadata(API_KEY_ACTIVE_META_KEY, [true]),
  );
}

/**
 * ApiKeyAdminDeleteGuard Decorator.
 *
 * Guards
 * - ApiKeyPutToRequestGuard - find apikey from params then put to `request.__apiKey`.
 * - ApiKeyNotFoundGuard - check `__apiKey` is exists.
 */
export function ApiKeyAdminDeleteGuard(): MethodDecorator {
  return applyDecorators(UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard));
}
