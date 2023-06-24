import { applyDecorators } from "@nestjs/common";
import { Doc } from "src/common/doc/decorators/doc.decorator";
import { UserLoginSerialization } from "../serializations/user.login.serialization";

export function UserAuthRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc<UserLoginSerialization>("user.refresh", {
      auth: {
        apiKey: true,
        jwtRefreshToken: true,
      },
      response: {
        serialization: UserLoginSerialization,
      },
    }),
  );
}
