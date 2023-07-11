import { applyDecorators, HttpStatus } from "@nestjs/common";
import {
  Doc,
  DocAllOf,
  DocAuth,
  DocDefault,
  DocErrorGroup,
  DocResponse,
} from "src/common/doc/decorators/doc.decorator";
import { ENUM_USER_STATUS_CODE_ERROR } from "../constants/user.status-code.constant";
import { UserInfoSerialization } from "../serializations/user.info.serialization";
import { UserProfileSerialization } from "../serializations/user.profile.serialization";
import { UserRefreshSerialization } from "../serializations/user.refresh.serialization";
import { UserUpdateNameSerialization } from "../serializations/user.update-name.serialization";

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

export function UserAuthChangePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.auth.user",
      description: "Api user change password",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocResponse("user.change-password"),
    DocErrorGroup([
      DocDefault({
        httpStatus: HttpStatus.NOT_FOUND,
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        messagePath: "user.error.notFound",
      }),
      DocDefault({
        httpStatus: HttpStatus.FORBIDDEN,
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR,
        messagePath: "user.error.passwordAttemptMax",
      }),
      DocAllOf(
        HttpStatus.BAD_REQUEST,
        {
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
          messagePath: "user.error.passwordNotMatch",
        },
        {
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
          messagePath: "user.error.newPasswordMustDifference",
        },
      ),
    ]),
  );
}

export function UserAuthUpdateNameDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: "modules.auth.user",
      description: "Api user firstName and lastName",
    }),
    DocAuth({
      jwtAccessToken: true,
      apiKey: true,
    }),
    DocResponse("user.updateName", { serialization: UserUpdateNameSerialization }),
  );
}
