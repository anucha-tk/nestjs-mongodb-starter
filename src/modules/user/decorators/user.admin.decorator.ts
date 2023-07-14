import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import {
  USER_ACTIVE_META_KEY,
  USER_BLOCKED_META_KEY,
  USER_DELETED_META_KEY,
  USER_INACTIVE_PERMANENT_META_KEY,
} from "../constants/user.constant";
import { UserActiveGuard } from "../guards/user.active.guard";
import { UserBlockedGuard } from "../guards/user.blocked.guard";
import { UserCanNotOurSelfGuard } from "../guards/user.can-not-ourself.guard";
import { UserDeletedGuard } from "../guards/user.delete.guard";
import { UserInactivePermanentGuard } from "../guards/user.inactive-permanent.guard";
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
 *
 * @returns MethodDecorator
 * */
export function UserAdminGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(UserPutToRequestGuard, UserNotFoundGuard));
}

/**
 * Decorator Guards includes
 * 1. UserPutToRequestGuard - find user from param and put to `request.__user`
 * 2. UserNotFoundGuard - throw 404 if `request.__user` it not exist
 * 3. UserCanNotOurSelfGuard - user login can't allow self
 * 4. UserBlockedGuard - allow user.blocked with `USER_BLOCKED_META_KEY` - boolean[]
 * @returns MethodDecorator
 * */
export function UserAdminUpdateBlockedGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPutToRequestGuard, UserNotFoundGuard, UserCanNotOurSelfGuard, UserBlockedGuard),
    SetMetadata(USER_BLOCKED_META_KEY, [false]),
  );
}

/**
 * Decorator Guards includes
 * 1. UserPutToRequestGuard - find user from param and put to `request.__user`
 * 2. UserNotFoundGuard - throw 404 if `request.__user` it not exist
 * 3. UserCanNotOurSelfGuard - user login can't allow self
 * 4. UserBlockedGuard - allow user.blocked with `USER_BLOCKED_META_KEY` - boolean[]
 * 5. UserInactivePermanentGuard - allow user.inactivePermanent with `USER_INACTIVE_PERMANENT_META_KEY` - boolean[]
 * 6. UserActiveGuard - allow user.isActive with `USER_ACTIVE_META_KEY` - boolean[]
 * */
export function UserAdminUpdateActiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(
      UserPutToRequestGuard,
      UserNotFoundGuard,
      UserCanNotOurSelfGuard,
      UserBlockedGuard,
      UserInactivePermanentGuard,
      UserActiveGuard,
    ),
    SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
    SetMetadata(USER_ACTIVE_META_KEY, [false]),
    SetMetadata(USER_BLOCKED_META_KEY, [false]),
  );
}

/**
 * Decorator Guards includes
 * 1. UserPutToRequestGuard - find user from param and put to `request.__user`
 * 2. UserNotFoundGuard - throw 404 if `request.__user` it not exist
 * 3. UserCanNotOurSelfGuard - user login can't allow self
 * 4. UserBlockedGuard - allow user.blocked with `USER_BLOCKED_META_KEY` - boolean[]
 * 5. UserInactivePermanentGuard - allow user.inactivePermanent with `USER_INACTIVE_PERMANENT_META_KEY` - boolean[]
 * 6. UserActiveGuard - allow user.isActive with `USER_ACTIVE_META_KEY` - boolean[]
 * */
export const UserAdminUpdateInactiveGuard = (): MethodDecorator =>
  applyDecorators(
    UseGuards(
      UserPutToRequestGuard,
      UserNotFoundGuard,
      UserCanNotOurSelfGuard,
      UserBlockedGuard,
      UserInactivePermanentGuard,
      UserActiveGuard,
    ),
    SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
    SetMetadata(USER_ACTIVE_META_KEY, [true]),
    SetMetadata(USER_BLOCKED_META_KEY, [false]),
  );

/**
 * Decorator Guards includes
 * 1. UserPutToRequestGuard - find user from param and put to `request.__user`
 * 2. UserNotFoundGuard - throw 404 if `request.__user` it not exist
 * 3. UserCanNotOurSelfGuard - user login can't allow self
 * @returns MethodDecorator
 * */
export function UserAdminSoftDeleteGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPutToRequestGuard, UserNotFoundGuard, UserCanNotOurSelfGuard),
  );
}

/**
 * Decorator Guards includes
 * 1. UserPutToRequestGuard - find user from param and put to `request.__user`
 * 2. UserNotFoundGuard - throw 404 if `request.__user` it not exist
 * 3. UserRestoreGuard - throw 404 if `request.__user.deleteAt` it not exist
 *
 * @returns MethodDecorator
 * */
export function UserAdminRestoreGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPutToRequestGuard, UserNotFoundGuard, UserDeletedGuard),
    SetMetadata(USER_DELETED_META_KEY, true),
  );
}

/**
 * Decorator Guards includes
 * 1. UserPutToRequestGuard - find user from param and put to `request.__user`
 * 2. UserNotFoundGuard - throw 404 if `request.__user` it not exist
 * 3. UserRestoreGuard - throw 404 if `request.__user.deleteAt` it not exist
 *
 * @returns MethodDecorator
 * */
export function UserAdminDeleteGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPutToRequestGuard, UserNotFoundGuard, UserDeletedGuard),
    SetMetadata(USER_DELETED_META_KEY, true),
  );
}
