import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ENUM_DOC_REQUEST_BODY_TYPE } from "src/common/doc/constants/doc.enum.constant";
import {
  Doc,
  DocAuth,
  DocDefault,
  DocErrorGroup,
  DocGuard,
  DocOneOf,
  DocRequest,
  DocResponse,
  DocResponseId,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import { ApiKeyDocParamsId, ApiKeyDocQueryIsActive } from "../constants/api-key.doc.constant";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "../constants/api-key.status-code.constant";
import { ApiKeyCreateSerialization } from "../serializations/api-key.create.serialization";
import { ApiKeyGetSerialization } from "../serializations/api-key.get.serialization";
import { ApiKeyListSerialization } from "../serializations/api-key.list.serialization";
import { ApiKeyResetSerialization } from "../serializations/api-key.reset.serialization";

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

export function ApiKeyAdminResetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      params: ApiKeyDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ApiKeyResetSerialization>("apiKey.reset", {
      serialization: ApiKeyResetSerialization,
    }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: "apiKey.error.notFound",
      }),
      DocOneOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR,
          messagePath: "apiKey.error.expired",
        },
        {
          statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_IS_ACTIVE_ERROR,
          messagePath: "apiKey.error.isActiveInvalid",
        },
      ),
    ]),
  );
}

export function ApiKeyAdminActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      params: ApiKeyDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("apiKey.active"),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: "apiKey.error.notFound",
      }),
      DocOneOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR,
          messagePath: "apiKey.error.expired",
        },
        {
          statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_IS_ACTIVE_ERROR,
          messagePath: "apiKey.error.isActiveInvalid",
        },
      ),
    ]),
  );
}

export function ApiKeyAdminInActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      params: ApiKeyDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("apiKey.inactive"),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: "apiKey.error.notFound",
      }),
      DocOneOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR,
          messagePath: "apiKey.error.expired",
        },
        {
          statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_IS_ACTIVE_ERROR,
          messagePath: "apiKey.error.isActiveInvalid",
        },
      ),
    ]),
  );
}

export function ApiKeyAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ApiKeyCreateSerialization>("apiKey.create", {
      serialization: ApiKeyCreateSerialization,
    }),
  );
}

export function ApiKeyAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      params: ApiKeyDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("apiKey.delete"),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: "apiKey.error.notFound",
      }),
    ]),
  );
}

export function ApiKeyAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      params: ApiKeyDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseId("apiKey.updateDate"),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: "apiKey.error.notFound",
      }),
    ]),
    DocOneOf(
      HttpStatus.BAD_REQUEST,
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR,
        messagePath: "apiKey.error.expired",
      },
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_IS_ACTIVE_ERROR,
        messagePath: "apiKey.error.isActiveInvalid",
      },
    ),
  );
}

export function ApiKeyAdminUpdateNameDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: "common.admin.apiKey" }),
    DocRequest({
      params: ApiKeyDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseId("apiKey.updateName"),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        messagePath: "apiKey.error.notFound",
      }),
    ]),
    DocOneOf(
      HttpStatus.BAD_REQUEST,
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR,
        messagePath: "apiKey.error.expired",
      },
      {
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_IS_ACTIVE_ERROR,
        messagePath: "apiKey.error.isActiveInvalid",
      },
    ),
  );
}
