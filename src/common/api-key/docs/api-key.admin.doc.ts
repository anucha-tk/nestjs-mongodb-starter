import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocDefault,
  DocErrorGroup,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import { ApiKeyDocParamsId, ApiKeyDocQueryIsActive } from "../constants/api-key.doc.constant";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "../constants/api-key.status-code.constant";
import { ApiKeyGetSerialization } from "../serializations/api-key.get.serialization";
import { ApiKeyListSerialization } from "../serializations/api-key.list.serialization";

export function ApiKeyAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      queries: ApiKeyDocQueryIsActive,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ApiKeyListSerialization>("apiKey.list", {
      serialization: ApiKeyListSerialization,
    }),
  );
}

export function ApiKeyAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      params: ApiKeyDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocResponse<ApiKeyGetSerialization>("apiKey.get", {
      serialization: ApiKeyGetSerialization,
    }),
    DocGuard({ role: true, policy: true }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: "apiKey.error.notFound",
      }),
    ]),
  );
}
