import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "../constants/role.status-code.constant";
import { RoleDoc } from "../repository/entities/role.entity";

/**
 * Guard 404 when `request.__role` not exist
 * */
@Injectable()
export class RoleNotFoundGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __role } = context.switchToHttp().getRequest<IRequestApp & { __role: RoleDoc }>();

    if (!__role) {
      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
        message: "role.error.notFound",
      });
    }

    return true;
  }
}
