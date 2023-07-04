import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocRequest,
  DocGuard,
  DocResponsePaging,
  DocErrorGroup,
  DocDefault,
  DocResponse,
} from "src/common/doc/decorators/doc.decorator";
import {
  RoleDocParamsId,
  RoleDocQueryIsActive,
  RoleDocQueryType,
} from "src/modules/role/constants/role.doc.constant";
import { RoleListSerialization } from "src/modules/role/serializations/role.list.serialization";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "../constants/role.status-code.constant";
import { RoleGetSerialization } from "../serializations/role.get.serialization";

export function RoleAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.role",
    }),
    DocRequest({
      queries: [...RoleDocQueryIsActive, ...RoleDocQueryType],
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<RoleListSerialization>("role.list", {
      serialization: RoleListSerialization,
    }),
  );
}

export function RoleAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.role",
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<RoleGetSerialization>("role.get", {
      serialization: RoleGetSerialization,
    }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
        messagePath: "role.error.notFound",
      }),
    ]),
  );
}
