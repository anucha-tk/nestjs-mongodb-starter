import { applyDecorators, HttpStatus } from "@nestjs/common";
import { Doc } from "src/common/doc/decorators/doc.decorator";
import { UserLoginSerialization } from "../serializations/user.login.serialization";

export function UserPublicLoginDoc(): MethodDecorator {
  return applyDecorators(
    Doc<UserLoginSerialization>("user.login", {
      auth: {
        apiKey: true,
      },
      response: {
        serialization: UserLoginSerialization,
      },
    }),
  );
}

export const UserPublicSignUpDoc = (): MethodDecorator =>
  applyDecorators(
    Doc<UserLoginSerialization>("user.signup", {
      auth: {
        apiKey: true,
      },
      response: {
        httpStatus: HttpStatus.CREATED,
      },
    }),
  );
