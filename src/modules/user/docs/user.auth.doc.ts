import { applyDecorators } from "@nestjs/common";
import { Doc, DocAuth, DocResponse } from "src/common/doc/decorators/doc.decorator";
import { UserInfoSerialization } from "../serializations/user.info.serialization";
import { UserRefreshSerialization } from "../serializations/user.refresh.serialization";

export function UserAuthRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.auth.user",
      description: "Api refresh jwt accessToken",
    }),
    DocAuth({
      jwtRefreshToken: true,
      apiKey: true,
    }),
    DocResponse<UserRefreshSerialization>("user.refresh", {
      serialization: UserRefreshSerialization,
    }),
  );
}

export function UserAuthInfoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.auth.user",
      description: "Api user serialization information",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocResponse("user.info", { serialization: UserInfoSerialization }),
  );
}
