import { applyDecorators } from "@nestjs/common";
import { DocPaging } from "src/common/doc/decorators/doc.decorator";
import { RoleDocQueryIsActive, RoleDocQueryType } from "../constants/role.doc.constant";
import { RoleListSerialization } from "../serializations/role.list.serialization";

export function RoleAdminListDoc(): MethodDecorator {
  return applyDecorators(
    DocPaging<RoleListSerialization>("role.list", {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        queries: [...RoleDocQueryIsActive, ...RoleDocQueryType],
      },
      response: {
        serialization: RoleListSerialization,
      },
    }),
  );
}
