import { applyDecorators } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import {
  UserDocParamsId,
  UserDocQueryBlocked,
  UserDocQueryInactivePermanent,
  UserDocQueryIsActive,
  UserDocQueryJoin,
  UserDocQueryRole,
} from "../constants/user.doc.constant";
import { UserGetSerialization } from "../serializations/user.get.serialization";
import { UserListSerialization } from "../serializations/user.list.serialization";

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
