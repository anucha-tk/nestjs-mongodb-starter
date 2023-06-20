import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ROLE_TYPE_META_KEY } from "src/modules/role/constants/role.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { RolePayloadTypeGuard } from "src/modules/role/guards/role.payload.type.guard";
import { AuthJwtAccessGuard } from "../guards/jwt-access/auth.jwt-access.guard";

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
