import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ENUM_DOC_REQUEST_BODY_TYPE } from "src/common/doc/constants/doc.enum.constant";
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocRequestFile,
  DocResponse,
  DocResponseFile,
  DocResponseId,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import {
  UserDocParamsId,
  UserDocQueryBlocked,
  UserDocQueryInactivePermanent,
  UserDocQueryIsActive,
  UserDocQueryJoin,
  UserDocQueryRole,
  UserDocQueryWithDeleted,
} from "../constants/user.doc.constant";
import { UserCreateSerialization } from "../serializations/user.create.serialization";
import { UserGetSerialization } from "../serializations/user.get.serialization";
import { UserListSerialization } from "../serializations/user.list.serialization";
import { UserUpdateNameSerialization } from "../serializations/user.update-name.serialization";

export function UserAdminBlockedDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("user.blocked"),
  );
}

export function UserAdminActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("user.active"),
  );
}

export function UserAdminInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("user.inactive"),
  );
}

export function UserAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      queries: [
        ...UserDocQueryRole,
        ...UserDocQueryBlocked,
        ...UserDocQueryIsActive,
        ...UserDocQueryInactivePermanent,
        ...UserDocQueryJoin,
        ...UserDocQueryWithDeleted,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging("user.list", { serialization: UserListSerialization }),
  );
}

export function UserAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("user.get", { serialization: UserGetSerialization }),
  );
}

export function UserAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse("user.create", { serialization: UserCreateSerialization }),
  );
}

export function UserAdminUpdateNameDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
      description: "Api user admin update firstName and lastName",
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocResponse("user.updateName", { serialization: UserUpdateNameSerialization }),
  );
}

export function UserAdminSoftDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseId("user.softDelete"),
  );
}

export function UserAdminRestoreDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseId("user.restore"),
  );
}

export function UserAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseId("user.delete"),
  );
}

export function UserAdminImportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocRequestFile(),
    DocGuard({ role: true, policy: true }),
    DocResponse("user.import", {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function UserAdminExportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.user",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseFile(),
  );
}
