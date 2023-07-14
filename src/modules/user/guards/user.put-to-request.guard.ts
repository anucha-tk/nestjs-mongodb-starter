import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import { USER_DELETED_META_KEY } from "../constants/user.constant";

/**
 * Guard receive userId on request params and findOneById if user exist add to `request.__user`
 * @default withDeleted - false
 * @property `request.__user` can be null if user not exist
 * @example
 *    ***How to enable withDeleted***
 *    SetMetadata(USER_DELETED_META_KEY, true),
 *
 *    put userId to url params like /api/v1/admin/user/update/:user/blocked
 *    can use with `@GetUser()` for get user from request.__user
 *
 * @returns Promise boolean
 * */
@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>();
    const withDeleted = this.reflector.getAllAndOverride<boolean>(USER_DELETED_META_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { params } = request;
    const { user } = params;

    const check: UserDoc = await this.userService.findOneById(user, {
      join: true,
      withDeleted,
    });
    request.__user = check;

    return true;
  }
}
