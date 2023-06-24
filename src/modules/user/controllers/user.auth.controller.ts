import { Controller, ForbiddenException, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/common/auth/services/auth.service";
import { UserService } from "../services/user.service";
import { Response } from "src/common/response/decorators/response.decorator";
import { UserLoginSerialization } from "../serializations/user.login.serialization";
import { GetUser } from "../decorators/user.admin.decorator";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { IResponse } from "src/common/response/interfaces/response.interface";
import { IUserDoc } from "../interfaces/user.interface";
import { UserDoc } from "../repository/entities/user.entity";
import {
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from "src/common/auth/decorators/auth.jwt.decorator";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import { UserAuthRefreshDoc } from "../docs/user.auth.doc";
import { UserAuthProtected, UserProtected } from "../decorators/user.decorator";

@ApiKeyPublicProtected()
@ApiTags("modules.auth.user")
@Controller({
  version: "1",
  path: "/user",
})
export class UserAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UserAuthRefreshDoc()
  @Response("user.refresh", { serialization: UserLoginSerialization })
  @UserAuthProtected()
  @UserProtected()
  @AuthJwtRefreshProtected()
  @HttpCode(HttpStatus.OK)
  @Post("/refresh")
  async refresh(
    @AuthJwtToken() refreshToken: string,
    @GetUser() user: UserDoc,
  ): Promise<IResponse> {
    const userWithRole: IUserDoc = await this.userService.joinWithRole(user);
    if (!userWithRole.role.isActive) {
      throw new ForbiddenException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
        message: "role.error.inactive",
      });
    }
    const [payload, tokenType, expiresIn, payloadEncryption] = await Promise.all([
      this.userService.payloadSerialization(userWithRole),
      this.authService.getTokenType(),
      this.authService.getAccessTokenExpirationTime(),
      this.authService.getPayloadEncryption(),
    ]);

    const payloadAccessToken: Record<string, any> = await this.authService.createPayloadAccessToken(
      payload,
    );
    let payloadHashedAccessToken: Record<string, any> | string = payloadAccessToken;
    if (payloadEncryption) {
      payloadHashedAccessToken = await this.authService.encryptAccessToken(payloadAccessToken);
    }
    const accessToken: string = await this.authService.createAccessToken(payloadHashedAccessToken);
    return {
      data: {
        tokenType,
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }
}