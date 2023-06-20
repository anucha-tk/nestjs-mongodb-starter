import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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
import { ResponsePaging } from "src/common/response/decorators/response.decorator";
import { IResponsePaging } from "src/common/response/interfaces/response.interface";
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
import { RoleAdminListDoc } from "../docs/role.admin.doc";
import { RoleEntity } from "../repository/entities/role.entity";
import { RoleListSerialization } from "../serializations/role.list.serialization";
import { RoleService } from "../services/role.service";

@ApiTags("common.admin.role")
@Controller({
  version: "1",
  path: "/role",
})
export class RoleAdminController {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly roleService: RoleService,
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
}
