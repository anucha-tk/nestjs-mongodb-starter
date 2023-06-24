import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import {
  USER_ACTIVE_META_KEY,
  USER_BLOCKED_META_KEY,
  USER_INACTIVE_PERMANENT_META_KEY,
} from "../constants/user.constant";
import { UserPayloadPutToRequestGuard } from "../guards/payload/user.payload.put-to-request.guard";
import { UserActiveGuard } from "../guards/user.active.guard";
import { UserBlockedGuard } from "../guards/user.blocked.guard";
import { UserInactivePermanentGuard } from "../guards/user.inactive-permanent.guard";
import { UserNotFoundGuard } from "../guards/user.not-found.guard";

/**
 * Guard user allow blocked, inactive-permanent and active
 * @returns MethodDecorator
 * */
export function UserAuthProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserBlockedGuard, UserInactivePermanentGuard, UserActiveGuard),
    SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
    SetMetadata(USER_BLOCKED_META_KEY, [false]),
    SetMetadata(USER_ACTIVE_META_KEY, [true]),
  );
}

/**
 * Get `request.user` find then put to `request.__user`
 * @throws 404 `ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR` if user undefined
 * @returns MethodDecorator
 * */
export function UserProtected(): MethodDecorator {
  return applyDecorators(UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard));
}
