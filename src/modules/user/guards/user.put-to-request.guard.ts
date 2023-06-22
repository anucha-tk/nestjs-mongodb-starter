import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";

/**
 * Guard receive userId on request params and findOneById if user exist add to `request.__user`
 * @param :user - userId
 * @property `request.__user` can be null if user not exist
 * @example
 * put userId to params like /api/v1/admin/user/update/:user/blocked
 * can use with `@GetUser()` for get user from request.__user
 * @returns Promise<boolean>
 * */
@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>();
    const { params } = request;
    const { user } = params;

    const check: UserDoc = await this.userService.findOneById(user, {
      join: true,
    });
    request.__user = check;

    return true;
  }
}
