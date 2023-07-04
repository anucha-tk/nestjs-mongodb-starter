import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
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
