import { applyDecorators } from "@nestjs/common";
import { Doc } from "src/common/doc/decorators/doc.decorator";
import { UserLoginSerialization } from "../serializations/user.login.serialization";

export function UserPublicLoginDoc(): MethodDecorator {
  return applyDecorators(
    Doc<UserLoginSerialization>("user.login", {
      auth: {
        jwtAccessToken: false,
      },
      response: {
        serialization: UserLoginSerialization,
      },
    }),
  );
}
