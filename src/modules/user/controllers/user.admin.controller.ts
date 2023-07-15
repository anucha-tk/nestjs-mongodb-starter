import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Put,
  UploadedFile,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import { AuthJwtAdminAccessProtected } from "src/common/auth/decorators/auth.jwt.decorator";
import { IAuthPassword } from "src/common/auth/interfaces/auth.interface";
import { AuthService } from "src/common/auth/services/auth.service";
import { UploadFileSingle } from "src/common/file/decorators/file.decorator";
import { IFileExtract } from "src/common/file/interfaces/file.interface";
import { FileExtractPipe } from "src/common/file/pipes/file.extract.pipe";
import { FileRequiredPipe } from "src/common/file/pipes/file.required.pipe";
import { FileSizeExcelPipe } from "src/common/file/pipes/file.size-excel.pipe";
import { FileTypeExcelPipe } from "src/common/file/pipes/file.type-excel.pipe";
import { FileValidationPipe } from "src/common/file/pipes/file.validation.pipe";
import { ENUM_HELPER_FILE_TYPE } from "src/common/helper/constants/helper.enum.constant";
import {
  PaginationQuery,
  PaginationQueryFilterEqualObjectId,
  PaginationQueryFilterInBoolean,
  PaginationQueryBoolean,
} from "src/common/pagination/decorators/pagination.decorator";
import { PaginationListDto } from "src/common/pagination/dtos/pagination.list.dto";
import { PaginationService } from "src/common/pagination/services/pagination.service";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { PolicyAbilityProtected } from "src/common/policy/decorators/policy.decorator";
import { RequestParamGuard } from "src/common/request/decorators/request.decorator";
import {
  Response,
  ResponseFile,
  ResponseId,
  ResponsePaging,
} from "src/common/response/decorators/response.decorator";
import { IResponse, IResponsePaging } from "src/common/response/interfaces/response.interface";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "src/modules/role/constants/role.status-code.constant";
import { RoleService } from "src/modules/role/services/role.service";
import {
  USER_DEFAULT_AVAILABLE_ORDER_BY,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_BLOCKED,
  USER_DEFAULT_INACTIVE_PERMANENT,
  USER_DEFAULT_IS_ACTIVE,
  USER_DEFAULT_ORDER_BY,
  USER_DEFAULT_ORDER_DIRECTION,
  USER_DEFAULT_PER_PAGE,
} from "../constants/user.list.constant";
import { ENUM_USER_STATUS_CODE_ERROR } from "../constants/user.status-code.constant";
import {
  GetUser,
  UserAdminDeleteGuard,
  UserAdminGetGuard,
  UserAdminRestoreGuard,
  UserAdminSoftDeleteGuard,
  UserAdminUpdateActiveGuard,
  UserAdminUpdateBlockedGuard,
  UserAdminUpdateInactiveGuard,
} from "../decorators/user.admin.decorator";
import {
  UserAdminActiveDoc,
  UserAdminBlockedDoc,
  UserAdminCreateDoc,
  UserAdminDeleteDoc,
  UserAdminExportDoc,
  UserAdminGetDoc,
  UserAdminImportDoc,
  UserAdminInactiveDoc,
  UserAdminListDoc,
  UserAdminRestoreDoc,
  UserAdminSoftDeleteDoc,
  UserAdminUpdateNameDoc,
} from "../docs/user.admin.doc";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserImportDto } from "../dtos/user.import.dto";
import { UserRequestDto } from "../dtos/user.request.dto";
import { UserUpdateNameDto } from "../dtos/user.update-name.dto";
import { IUserEntity } from "../interfaces/user.interface";
import { UserDoc } from "../repository/entities/user.entity";
import { UserCreateSerialization } from "../serializations/user.create.serialization";
import { UserGetSerialization } from "../serializations/user.get.serialization";
import { UserListSerialization } from "../serializations/user.list.serialization";
import { UserUpdateNameSerialization } from "../serializations/user.update-name.serialization";
import { UserService } from "../services/user.service";

@ApiKeyPublicProtected()
@ApiTags("modules.admin.user")
@Controller({
  version: "1",
  path: "/user",
})
export class UserAdminController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
    private readonly paginationService: PaginationService,
  ) {}

  @UserAdminListDoc()
  @ResponsePaging("user.list", { serialization: UserListSerialization })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @Get("/list")
  async list(
    @PaginationQuery(
      USER_DEFAULT_PER_PAGE,
      USER_DEFAULT_ORDER_BY,
      USER_DEFAULT_ORDER_DIRECTION,
      USER_DEFAULT_AVAILABLE_SEARCH,
      USER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean("isActive", USER_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInBoolean("blocked", USER_DEFAULT_BLOCKED)
    blocked: Record<string, any>,
    @PaginationQueryFilterInBoolean("inactivePermanent", USER_DEFAULT_INACTIVE_PERMANENT)
    inactivePermanent: Record<string, any>,
    @PaginationQueryFilterEqualObjectId("role", "role", true)
    role: Record<string, any>,
    @PaginationQueryBoolean({ queryField: "join", defaultValue: false })
    join: boolean,
    @PaginationQueryBoolean({ queryField: "withDeleted", defaultValue: false })
    withDeleted: boolean,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
      ...blocked,
      ...inactivePermanent,
      ...role,
    };

    const users: IUserEntity[] = await this.userService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
      join,
      withDeleted,
    });

    const total: number = await this.userService.getTotal(find, { withDeleted });
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: users,
    };
  }
  // TODO: findDelete

  @UserAdminGetDoc()
  @Response("user.get", { serialization: UserGetSerialization })
  @UserAdminGetGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Get("/get/:user")
  async get(@GetUser(true) user: UserDoc): Promise<IResponse> {
    return { data: user };
  }

  @UserAdminCreateDoc()
  @Response("user.create", { serialization: UserCreateSerialization })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.CREATE],
  })
  @AuthJwtAdminAccessProtected()
  @Post("/create")
  async create(
    @Body() { userName, email, password, mobileNumber, role, ...body }: UserCreateDto,
  ): Promise<IResponse> {
    const [roleDoc, isEmailExist] = await Promise.all([
      this.roleService.findOneById(role),
      this.userService.existByEmail(email),
    ]);

    if (!roleDoc) {
      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
        message: "role.error.notFound",
      });
    } else if (!roleDoc.isActive) {
      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_ACTIVE_ERROR,
        message: "role.error.isActiveInvalid",
      });
    }
    if (isEmailExist) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
        message: "user.error.emailExist",
      });
    }

    if (userName) {
      const isUserNameExist: boolean = await this.userService.existByUsername(userName);
      if (isUserNameExist) {
        throw new BadRequestException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
          message: "user.error.userNameExist",
        });
      }
    }

    if (mobileNumber) {
      const isMobileNumberExist: boolean = await this.userService.existByMobileNumber(mobileNumber);

      if (isMobileNumberExist) {
        throw new BadRequestException({
          statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
          message: "user.error.mobileNumberExist",
        });
      }
    }

    const iAuthPassword: IAuthPassword = await this.authService.createPassword(password);
    const user = await this.userService.create(
      { userName, email, role, mobileNumber, ...body },
      iAuthPassword,
    );

    return { data: user };
  }

  @UserAdminUpdateNameDoc()
  @Response("user.updateName", { serialization: UserUpdateNameSerialization })
  @UserAdminGetGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Put("/update-name/:user")
  async update(@GetUser() user: UserDoc, @Body() body: UserUpdateNameDto): Promise<IResponse> {
    const update = await this.userService.updateName(user, body).then((e) => e.toObject());
    return { data: update };
  }

  @UserAdminSoftDeleteDoc()
  @ResponseId("user.softDelete")
  @UserAdminSoftDeleteGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Response("user.softDelete")
  @Delete("/soft-delete/:user")
  async softDelete(@GetUser() user: UserDoc): Promise<IResponse> {
    await this.userService.softDelete(user);
    return { data: { _id: user._id } };
  }

  @UserAdminRestoreDoc()
  @ResponseId("user.restore")
  @UserAdminRestoreGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Patch("/restore/:user")
  async restore(@GetUser() user: UserDoc): Promise<IResponse> {
    await this.userService.restore(user);
    return { data: { _id: user._id } };
  }

  @UserAdminDeleteDoc()
  @ResponseId("user.delete")
  @UserAdminDeleteGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Delete("/delete/:user")
  async delete(@GetUser() user: UserDoc): Promise<IResponse> {
    await this.userService.deleteOne(user);
    return { data: { _id: user._id } };
  }

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
    await this.userService.blocked(user);
    return;
  }

  @UserAdminActiveDoc()
  @Response("user.active")
  @UserAdminUpdateActiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Patch("/update/:user/active")
  async active(@GetUser() user: UserDoc): Promise<void> {
    await this.userService.active(user);
    return;
  }

  @UserAdminInactiveDoc()
  @Response("user.inactive")
  @UserAdminUpdateInactiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(UserRequestDto)
  @Patch("/update/:user/inactive")
  async inactive(@GetUser() user: UserDoc): Promise<void> {
    await this.userService.inactive(user);
    return;
  }

  @UserAdminImportDoc()
  @Response("user.import")
  @UploadFileSingle("file")
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE, ENUM_POLICY_ACTION.IMPORT],
  })
  @AuthJwtAdminAccessProtected()
  @Post("/import")
  async import(
    @UploadedFile(
      FileRequiredPipe,
      FileSizeExcelPipe,
      FileTypeExcelPipe,
      FileExtractPipe,
      new FileValidationPipe<UserImportDto>(UserImportDto),
    )
    file: IFileExtract<UserImportDto>,
  ): Promise<void> {
    const [role, passwordString] = await Promise.all([
      this.roleService.findOneByName("user"),
      this.authService.createPasswordRandom(),
    ]);

    const password: IAuthPassword = await this.authService.createPassword(passwordString);

    await this.userService.import(file.dto, role._id, password);

    return;
  }

  @UserAdminExportDoc()
  @ResponseFile({
    serialization: UserListSerialization,
    fileType: ENUM_HELPER_FILE_TYPE.CSV,
  })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.EXPORT],
  })
  @AuthJwtAdminAccessProtected()
  @HttpCode(HttpStatus.OK)
  @Post("/export")
  async export(): Promise<IResponse> {
    const users: IUserEntity[] = await this.userService.findAll({});

    return { data: users };
  }
}
