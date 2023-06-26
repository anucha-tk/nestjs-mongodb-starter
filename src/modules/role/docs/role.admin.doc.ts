import { applyDecorators } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocRequest,
  DocGuard,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import {
  RoleDocQueryIsActive,
  RoleDocQueryType,
} from "src/modules/role/constants/role.doc.constant";
import { RoleListSerialization } from "src/modules/role/serializations/role.list.serialization";

export function RoleAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.role",
    }),
    DocRequest({
      queries: [...RoleDocQueryIsActive, ...RoleDocQueryType],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<RoleListSerialization>("role.list", {
      serialization: RoleListSerialization,
    }),
  );
}
