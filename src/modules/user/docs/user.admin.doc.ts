import { applyDecorators } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from "src/common/doc/decorators/doc.decorator";
import { UserDocParamsId } from "../constants/user.doc.constant";

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
