import { Controller, InternalServerErrorException, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import { AuthJwtAdminAccessProtected } from "src/common/auth/decorators/auth.jwt.decorator";
import { ENUM_ERROR_STATUS_CODE_ERROR } from "src/common/error/constants/error.status-code.constant";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { PolicyAbilityProtected } from "src/common/policy/decorators/policy.decorator";
import { RequestParamGuard } from "src/common/request/decorators/request.decorator";
import { Response } from "src/common/response/decorators/response.decorator";
import { GetUser, UserAdminUpdateBlockedGuard } from "../decorators/user.admin.decorator";
import { UserAdminBlockedDoc } from "../docs/user.admin.doc";
import { UserRequestDto } from "../dtos/user.request.dto";
import { UserDoc } from "../repository/entities/user.entity";
import { UserService } from "../services/user.service";

@ApiKeyPublicProtected()
@ApiTags("modules.admin.user")
@Controller({
  version: "1",
  path: "/user",
})
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @UserAdminBlockedDoc()
  @Response("user.blocked")
  @UserAdminUpdateBlockedGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Patch("/update/:user/blocked")
  async blocked(@GetUser() user: UserDoc): Promise<void> {
    try {
      await this.userService.blocked(user);
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: "http.serverError.internalServerError",
        _error: err.message,
      });
    }
    return;
  }
}
