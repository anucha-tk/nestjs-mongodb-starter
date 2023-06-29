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
import { ENUM_API_KEY_TYPE } from "../constants/api-key.enum.constant";
import {
  API_KEY_DEFAULT_AVAILABLE_ORDER_BY,
  API_KEY_DEFAULT_AVAILABLE_SEARCH,
  API_KEY_DEFAULT_IS_ACTIVE,
  API_KEY_DEFAULT_ORDER_BY,
  API_KEY_DEFAULT_ORDER_DIRECTION,
  API_KEY_DEFAULT_PER_PAGE,
  API_KEY_DEFAULT_TYPE,
} from "../constants/api-key.list.constant";
import { ApiKeyPublicProtected } from "../decorators/api-key.decorator";
import { ApiKeyAdminListDoc } from "../docs/api-key.admin.doc";
import { ApiKeyEntity } from "../repository/entities/api-key.entity";
import { ApiKeyListSerialization } from "../serializations/api-key.list.serialization";
import { ApiKeyService } from "../services/api-key.service";

@ApiKeyPublicProtected()
@ApiTags("common.admin.apiKey")
@Controller({
  version: "1",
  path: "/api-key",
})
export class ApiKeyAdminController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly paginationService: PaginationService,
  ) {}

  @ApiKeyAdminListDoc()
  @ResponsePaging("apiKey.list", {
    serialization: ApiKeyListSerialization,
  })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @Get("/list")
  async list(
    @PaginationQuery(
      API_KEY_DEFAULT_PER_PAGE,
      API_KEY_DEFAULT_ORDER_BY,
      API_KEY_DEFAULT_ORDER_DIRECTION,
      API_KEY_DEFAULT_AVAILABLE_SEARCH,
      API_KEY_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean("isActive", API_KEY_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInEnum("type", API_KEY_DEFAULT_TYPE, ENUM_API_KEY_TYPE)
    type: Record<string, any>,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
      ...type,
    };

    const apiKeys: ApiKeyEntity[] = await this.apiKeyService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this.apiKeyService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { totalPage, total },
      data: apiKeys,
    };
  }
}
