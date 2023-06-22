import { applyDecorators } from "@nestjs/common";
import { Doc } from "src/common/doc/decorators/doc.decorator";
import { UserDocParamsGet } from "../constants/user.doc.constant";

export function UserAdminBlockedDoc(): MethodDecorator {
  return applyDecorators(
    Doc<void>("user.blocked", {
      auth: {
        jwtAccessToken: true,
        apiKey: true,
      },
      request: {
        params: UserDocParamsGet,
      },
    }),
  );
}
