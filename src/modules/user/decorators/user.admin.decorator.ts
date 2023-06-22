import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { USER_BLOCKED_META_KEY } from "../constants/user.constant";
import { UserBlockedGuard } from "../guards/user.blocked.guard";
import { UserCanNotOurSelfGuard } from "../guards/user.can-not-ourself.guard";
import { UserNotFoundGuard } from "../guards/user.not-found.guard";
import { UserPutToRequestGuard } from "../guards/user.put-to-request.guard";
import { UserDoc, UserEntity } from "../repository/entities/user.entity";

/**
 * Decorator get user from `request.__user`
 * @returns MethodDecorator
 * */
export const GetUser = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): UserDoc | UserEntity => {
    const { __user } = ctx.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>();
    return returnPlain ? __user.toObject() : __user;
  },
);

/**
 * Decorator Guards includes
 * 1. UserPutToRequestGuard - find user from param and put to `request.__user`
 * 2. UserNotFoundGuard - throw 404 if `request.__user` it not exist
 * 3. UserCanNotOurSelfGuard - user login can't allow self
 * 4. UserBlockedGuard - allow user.blocked with `USER_BLOCKED_META_KEY` - boolean
 * @returns MethodDecorator
 * */
export function UserAdminUpdateBlockedGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPutToRequestGuard, UserNotFoundGuard, UserCanNotOurSelfGuard, UserBlockedGuard),
    SetMetadata(USER_BLOCKED_META_KEY, [false]),
  );
}
