import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { ROLE_TYPE_META_KEY } from "src/modules/role/constants/role.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { RolePayloadTypeGuard } from "src/modules/role/guards/role.payload.type.guard";
import { UserPayloadSerialization } from "src/modules/user/serializations/user.payload.serialization";
import { AuthJwtAccessGuard } from "../guards/jwt-access/auth.jwt-access.guard";
import { AuthJwtRefreshGuard } from "../guards/jwt-refresh/auth.jwt-refresh.guard";

/**
 * Guard JWT Authentication and Guard allow if user hasFor type SUPER_ADMIN and ADMIN
 * add user to app request
 * @example req.user
 * @returns MethodDecorator
 * */
export function AuthJwtAdminAccessProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
    SetMetadata(ROLE_TYPE_META_KEY, [ENUM_ROLE_TYPE.SUPER_ADMIN, ENUM_ROLE_TYPE.ADMIN]),
  );
}

/**
 * get user from app request
 * @example
 * request.user
 * @returns user
 * */
export const AuthJwtPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { user: UserPayloadSerialization }>();
    return data ? user[data] : user;
  },
);

/**
 * Guard refreshToken with AuthGuard("jwtRefresh")
 * @throws 401 `ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_REFRESH_TOKEN_ERROR`
 * */
export function AuthJwtRefreshProtected(): MethodDecorator {
  return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}

/**
 * Get authorization token from header request
 * @returns AccessToken string or undefined
 * */
export const AuthJwtToken = createParamDecorator((_: string, ctx: ExecutionContext): string => {
  const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
  const { authorization } = headers;
  const authorizations: string[] = authorization.split(" ");

  return authorizations.length >= 2 ? authorizations[1] : undefined;
});
