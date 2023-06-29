import { applyDecorators } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import { ApiKeyDocQueryIsActive } from "../constants/api-key.doc.constant";
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
