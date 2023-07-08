import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import { AuthJwtAdminAccessProtected } from "src/common/auth/decorators/auth.jwt.decorator";
import {
  PaginationQuery,
  PaginationQueryFilterInBoolean,
  PaginationQueryFilterInEnum,
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
  ResponseId,
  ResponsePaging,
} from "src/common/response/decorators/response.decorator";
import { IResponse, IResponsePaging } from "src/common/response/interfaces/response.interface";
import { UserService } from "src/modules/user/services/user.service";
import { ENUM_ROLE_TYPE } from "../constants/role.enum.constant";
import {
  ROLE_DEFAULT_AVAILABLE_ORDER_BY,
  ROLE_DEFAULT_AVAILABLE_SEARCH,
  ROLE_DEFAULT_IS_ACTIVE,
  ROLE_DEFAULT_ORDER_BY,
  ROLE_DEFAULT_ORDER_DIRECTION,
  ROLE_DEFAULT_PER_PAGE,
  ROLE_DEFAULT_TYPE,
} from "../constants/role.list.constant";
import { ENUM_ROLE_STATUS_CODE_ERROR } from "../constants/role.status-code.constant";
import {
  GetRole,
  RoleCheckActiveGuard,
  RoleGetGuard,
  RoleInActiveGuard,
  RoleUpdateGuard,
  RoleUpdatePermissionsGuard,
} from "../decorators/role.decorator";
import {
  RoleAdminActiveDoc,
  RoleAdminCreateDoc,
  RoleAdminDeleteDoc,
  RoleAdminGetDoc,
  RoleAdminInActiveDoc,
  RoleAdminListDoc,
  RoleAdminUpdateDoc,
  RoleAdminUpdatePermissionDoc,
} from "../docs/role.admin.doc";
import { RoleCreateDto } from "../dtos/role.create.dto";
import { RoleRequestDto } from "../dtos/role.request.dto";
import { RoleUpdatePermissionsDto } from "../dtos/role.update-permissions.dto";
import { RoleUpdateDto } from "../dtos/role.update.dto";
import { RoleDoc, RoleEntity } from "../repository/entities/role.entity";
import { RoleActiveSerialization } from "../serializations/role.active.serialization";
import { RoleGetSerialization } from "../serializations/role.get.serialization";
import { RoleInActiveSerialization } from "../serializations/role.inActive.serialization";
import { RoleListSerialization } from "../serializations/role.list.serialization";
import { RoleUpdatePermissionsSerialization } from "../serializations/role.update-permissions.serialization";
import { RoleUpdateSerialization } from "../serializations/role.update.serialization";
import { RoleService } from "../services/role.service";

@ApiKeyPublicProtected()
@ApiTags("modules.admin.role")
@Controller({
  version: "1",
  path: "/role",
})
export class RoleAdminController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @RoleAdminListDoc()
  @ResponsePaging("role.list", {
    serialization: RoleListSerialization,
  })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @Get("/list")
  async list(
    @PaginationQuery(
      ROLE_DEFAULT_PER_PAGE,
      ROLE_DEFAULT_ORDER_BY,
      ROLE_DEFAULT_ORDER_DIRECTION,
      ROLE_DEFAULT_AVAILABLE_SEARCH,
      ROLE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean("isActive", ROLE_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInEnum("type", ROLE_DEFAULT_TYPE, ENUM_ROLE_TYPE)
    type: Record<string, any>,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
      ...type,
    };

    const roles: RoleEntity[] = await this.roleService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.roleService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: roles,
    };
  }

  @RoleAdminGetDoc()
  @Response("role.get", { serialization: RoleGetSerialization })
  @RoleGetGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(RoleRequestDto)
  @Get("/get/:role")
  async get(@GetRole(true) role: RoleDoc): Promise<IResponse> {
    return { data: role };
  }

  @RoleAdminCreateDoc()
  @ResponseId("role.create")
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
  })
  @AuthJwtAdminAccessProtected()
  @Post("/create")
  async create(@Body() body: RoleCreateDto): Promise<IResponse> {
    const existName = await this.roleService.existByName(body.name);
    if (existName) {
      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
        message: "role.error.exist",
      });
    }
    const { _id } = await this.roleService.create(body);
    return {
      data: { _id },
    };
  }

  @RoleAdminUpdateDoc()
  @Response("role.update", { serialization: RoleUpdateSerialization })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RoleUpdateGuard()
  @RequestParamGuard(RoleRequestDto)
  @Put("/update/:role")
  async update(@GetRole() role: RoleDoc, @Body() body: RoleUpdateDto): Promise<IResponse> {
    const existName = await this.roleService.existByName(body.name);

    if (existName) {
      throw new ConflictException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
        message: "role.error.exist",
      });
    }
    const update = await this.roleService.update(role, body);
    return { data: update };
  }

  @RoleAdminUpdatePermissionDoc()
  @Response("role.updatePermissions", { serialization: RoleUpdatePermissionsSerialization })
  @RoleUpdatePermissionsGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(RoleRequestDto)
  @Put("/update/:role/permissions")
  async updatePermission(
    @GetRole() role: RoleDoc,
    @Body() dto: RoleUpdatePermissionsDto,
  ): Promise<IResponse> {
    const { _id, type, permissions } = await this.roleService
      .updatePermissions(role, dto)
      .then((e) => e.toObject());

    return {
      data: {
        _id,
        type,
        permissions,
      },
    };
  }

  @RoleAdminDeleteDoc()
  @ResponseId("role.delete")
  @RoleGetGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(RoleRequestDto)
  @Delete("/delete/:role")
  async delete(@GetRole() role: RoleDoc): Promise<IResponse> {
    const used = await this.userService.findOne({
      role: role._id,
    });
    if (used) {
      throw new ConflictException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_USED_ERROR,
        message: "role.error.used",
      });
    }
    const { _id } = await this.roleService.delete(role);
    return { data: { _id } };
  }

  @RoleAdminInActiveDoc()
  @Response("role.inactive", { serialization: RoleInActiveSerialization })
  @RoleInActiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(RoleRequestDto)
  @Patch("/update/:role/inactive")
  async inActive(@GetRole() role: RoleDoc): Promise<IResponse> {
    const { isActive } = await this.roleService.inActive(role);
    return {
      data: {
        _id: role._id,
        isActive,
      },
    };
  }

  @RoleAdminActiveDoc()
  @Response("role.active", { serialization: RoleActiveSerialization })
  @RoleCheckActiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.ROLE,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(RoleRequestDto)
  @Patch("/update/:role/active")
  async active(@GetRole() role: RoleDoc): Promise<IResponse> {
    const { isActive } = await this.roleService.active(role);
    return {
      data: {
        _id: role._id,
        isActive,
      },
    };
  }
}
