import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";

/**
 * Guard get user from request app and put to `request.__user`
 * @argument  user is type UserDoc or undefined
 * @returns boolean
 * */
@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestApp & { __user: UserDoc }>();
    const { user } = request;

    const check: UserDoc = await this.userService.findOneById(user._id, {
      join: true,
    });
    request.__user = check;

    return true;
  }
}
