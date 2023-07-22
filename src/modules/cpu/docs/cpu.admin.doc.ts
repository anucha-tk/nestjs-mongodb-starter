import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequestFile,
  DocResponse,
} from "src/common/doc/decorators/doc.decorator";

export function CPUAdminImportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.admin.cpu",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocRequestFile(),
    DocGuard({ role: true, policy: true }),
    DocResponse("cpu.import", {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}
