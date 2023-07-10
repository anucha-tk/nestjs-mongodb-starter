import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  Doc,
  DocAuth,
  DocDefault,
  DocErrorGroup,
  DocResponse,
} from "src/common/doc/decorators/doc.decorator";
import { ENUM_USER_STATUS_CODE_ERROR } from "../constants/user.status-code.constant";
import { UserInfoSerialization } from "../serializations/user.info.serialization";
import { UserProfileSerialization } from "../serializations/user.profile.serialization";
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

export function UserAuthProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.auth.user",
      description: "Api user serialization profile",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocResponse("user.profile", { serialization: UserProfileSerialization }),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        messagePath: "user.error.notFound",
      }),
    ]),
  );
}
