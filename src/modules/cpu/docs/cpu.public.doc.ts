import { applyDecorators } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import { MultiQueryOperators } from "../constants/cpu.doc.constant";
import { CPUListSerialization } from "../serializations/cpu.list.serialization";

export function CPUAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.cpu",
    }),
    DocRequest({
      queries: [...MultiQueryOperators],
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging("cpu.list", { serialization: CPUListSerialization }),
  );
}
