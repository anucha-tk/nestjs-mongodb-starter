import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from "@nestjs/common";
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
  AuthJwtAccessProtected,
  AuthJwtPayload,
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from "src/common/auth/decorators/auth.jwt.decorator";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import {
  UserAuthChangePasswordDoc,
  UserAuthInfoDoc,
  UserAuthProfileDoc,
  UserAuthRefreshDoc,
  UserAuthUpdateNameDoc,
} from "../docs/user.auth.doc";
import { UserAuthProtected, UserProtected } from "../decorators/user.decorator";
import { UserPayloadSerialization } from "../serializations/user.payload.serialization";
import { UserInfoSerialization } from "../serializations/user.info.serialization";
import { UserProfileSerialization } from "../serializations/user.profile.serialization";
import { UserChangePasswordDto } from "../dtos/user.change-password.dto";
import { ConfigService } from "@nestjs/config";
import { ENUM_USER_STATUS_CODE_ERROR } from "../constants/user.status-code.constant";
import { UserUpdateNameDto } from "../dtos/user.update-name.dto";
import { UserUpdateNameSerialization } from "../serializations/user.update-name.serialization";

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
    private readonly configService: ConfigService,
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

  @UserAuthChangePasswordDoc()
  @Response("user.change-password")
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch("/change-password")
  async changePassword(
    @GetUser() user: UserDoc,
    @Body() body: UserChangePasswordDto,
  ): Promise<void> {
    const [passwordAttempt, maxPasswordAttempt] = await Promise.all([
      this.configService.get<boolean>("auth.password.attempt"),
      this.configService.get<number>("auth.password.maxAttempt"),
    ]);
    if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
      throw new ForbiddenException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR,
        message: "user.error.passwordAttemptMax",
      });
    }

    const isPasswordMatch: boolean = await this.authService.validateUser(
      body.oldPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      await this.userService.increasePasswordAttempt(user);
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
        message: "user.error.passwordNotMatch",
      });
    }

    const newMatchPassword: boolean = await this.authService.validateUser(
      body.newPassword,
      user.password,
    );
    if (newMatchPassword) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
        message: "user.error.newPasswordMustDifference",
      });
    }

    const [newAuthPassword] = await Promise.all([
      this.authService.createPassword(body.newPassword),
      this.userService.resetPasswordAttempt(user),
    ]);

    await this.userService.updatePassword(user, newAuthPassword);
    return;
  }

  @UserAuthInfoDoc()
  @Response("user.info", { serialization: UserInfoSerialization })
  @AuthJwtAccessProtected()
  @Get("/info")
  async info(@AuthJwtPayload() user: UserPayloadSerialization): Promise<IResponse> {
    return { data: user };
  }

  @UserAuthProfileDoc()
  @Response("user.profile", { serialization: UserProfileSerialization })
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get("/profile")
  async profile(@GetUser() user: UserDoc): Promise<IResponse> {
    const userWithRole = await this.userService.joinWithRole(user);
    return { data: userWithRole.toObject() };
  }

  @UserAuthUpdateNameDoc()
  @Response("user.updateName", { serialization: UserUpdateNameSerialization })
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch("/update-name")
  async updateName(@GetUser() user: UserDoc, @Body() body: UserUpdateNameDto): Promise<IResponse> {
    const { firstName, lastName } = await this.userService
      .updateName(user, body)
      .then((e) => e.toObject());
    return { data: { _id: user._id, firstName, lastName } };
  }
}
