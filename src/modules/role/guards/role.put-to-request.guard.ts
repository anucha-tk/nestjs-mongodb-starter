import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { RoleDoc } from "../repository/entities/role.entity";
import { RoleService } from "../services/role.service";

/**
 * Get roleId from request params find and put to app request
 * @example
 *    use request.__role - can be undefined
 * */
@Injectable()
export class RolePutToRequestGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestApp & { __role: RoleDoc }>();
    const { params } = request;
    const { role } = params;

    const check = await this.roleService.findOneById(role);
    request.__role = check;

    return true;
  }
}
