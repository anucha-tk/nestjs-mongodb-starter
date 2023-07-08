import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { ROLE_IS_ACTIVE_META_KEY } from "../constants/role.constant";
import { RoleActiveGuard } from "../guards/role.active.guard";
import { RoleNotFoundGuard } from "../guards/role.not-found.guard";
import { RolePutToRequestGuard } from "../guards/role.put-to-request.guard";
import { RoleDoc, RoleEntity } from "../repository/entities/role.entity";

/**
 * Get `__role`
 * @param {boolean} returnPlain return toObject()
 * @return RoleDoc or RoleEntity
 */
export const GetRole = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): RoleDoc | RoleEntity => {
    const { __role } = ctx.switchToHttp().getRequest<IRequestApp & { __role: RoleDoc }>();
    return returnPlain ? __role.toObject() : __role;
  },
);

export function RoleGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(RolePutToRequestGuard, RoleNotFoundGuard));
}

export function RoleInActiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
    SetMetadata(ROLE_IS_ACTIVE_META_KEY, [true]),
  );
}
