import { applyDecorators } from "@nestjs/common";
import { Doc, DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { UserRefreshSerialization } from "../serializations/user.refresh.serialization";

export function UserAuthRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.auth.user",
    }),
    DocAuth({
      jwtRefreshToken: true,
    }),
    DocResponse<UserRefreshSerialization>("user.refresh", {
      serialization: UserRefreshSerialization,
    }),
  );
}
