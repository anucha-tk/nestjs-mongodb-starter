import { applyDecorators } from "@nestjs/common";
import { Doc, DocAuth, DocGuard, DocResponsePaging } from "src/common/doc/decorators/doc.decorator";
import { CPUListSerialization } from "../serializations/cpu.list.serialization";

export function CPUAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.cpu",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging("cpu.list", { serialization: CPUListSerialization }),
  );
}
