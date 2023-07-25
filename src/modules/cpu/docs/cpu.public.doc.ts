import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocDefault,
  DocErrorGroup,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from "src/common/doc/decorators/doc.decorator";
import { CPUDocParamsId, MultiQueryOperators } from "../constants/cpu.doc.constant";
import { ENUM_CPU_STATUS_CODE_ERROR } from "../constants/cpu.status-code.constant";
import { CPUGetSerialization } from "../serializations/cpu.get.serialization";
import { CPUListSerialization } from "../serializations/cpu.list.serialization";

export function CPUPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.public.cpu",
    }),
    DocRequest({
      queries: [...MultiQueryOperators],
    }),
    DocAuth({
      apiKey: true,
    }),
    DocResponsePaging("cpu.list", { serialization: CPUListSerialization }),
  );
}

export function CPUPublicGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.public.cpu",
    }),
    DocRequest({
      params: CPUDocParamsId,
    }),
    DocAuth({
      apiKey: true,
    }),
    DocResponse("cpu.get", { serialization: CPUGetSerialization }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_CPU_STATUS_CODE_ERROR.CPU_NOT_FOUND_ERROR,
        messagePath: "cpu.error.notFound",
      }),
    ]),
  );
}
