import { Body, Controller, Delete, Get, Patch, Post, Put } from "@nestjs/common";
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
import { RequestParamGuard } from "src/common/request/decorators/request.decorator";
import { Response, ResponsePaging } from "src/common/response/decorators/response.decorator";
import { IResponse, IResponsePaging } from "src/common/response/interfaces/response.interface";
import { ResponseIdSerialization } from "src/common/response/serializations/response.id.serialization";
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
import {
  ApiKeyAdminDeleteGuard,
  ApiKeyAdminGetGuard,
  ApiKeyAdminUpdateActiveGuard,
  ApiKeyAdminUpdateGuard,
  ApiKeyAdminUpdateInActiveGuard,
} from "../decorators/api-key.admin.decorator";
import { ApiKeyPublicProtected, GetApiKey } from "../decorators/api-key.decorator";
import {
  ApiKeyAdminActiveDoc,
  ApiKeyAdminCreateDoc,
  ApiKeyAdminDeleteDoc,
  ApiKeyAdminGetDoc,
  ApiKeyAdminInActiveDoc,
  ApiKeyAdminListDoc,
  ApiKeyAdminResetDoc,
  ApiKeyAdminUpdateDoc,
  ApiKeyAdminUpdateNameDoc,
} from "../docs/api-key.admin.doc";
import { ApiKeyCreateDto } from "../dtos/api-key.create.dto";
import { ApiKeyRequestDto } from "../dtos/api-key.request.dto";
import { ApiKeyUpdateDateDto } from "../dtos/api-key.update-date.dto";
import { ApiKeyUpdateNameDto } from "../dtos/api-key.update-name.dto";
import { ApiKeyDoc, ApiKeyEntity } from "../repository/entities/api-key.entity";
import { ApiKeyGetSerialization } from "../serializations/api-key.get.serialization";
import { ApiKeyListSerialization } from "../serializations/api-key.list.serialization";
import { ApiKeyResetSerialization } from "../serializations/api-key.reset.serialization";
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

  @ApiKeyAdminGetDoc()
  @Response("apiKey.get", {
    serialization: ApiKeyGetSerialization,
  })
  @ApiKeyAdminGetGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Get("/get/:apiKey")
  async get(@GetApiKey(true) apiKey: ApiKeyEntity): Promise<IResponse> {
    return { data: apiKey };
  }

  @ApiKeyAdminResetDoc()
  @Response("apiKey.reset", { serialization: ApiKeyResetSerialization })
  @ApiKeyAdminUpdateGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Patch("/update/:apiKey/reset")
  async reset(@GetApiKey() apiKey: ApiKeyDoc): Promise<IResponse> {
    const secret: string = await this.apiKeyService.createSecret();
    const updated: ApiKeyDoc = await this.apiKeyService.reset(apiKey, secret);

    return {
      data: {
        _id: updated._id,
        secret,
      },
    };
  }

  @ApiKeyAdminActiveDoc()
  @Response("apiKey.active")
  @ApiKeyAdminUpdateActiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Patch("/update/:apiKey/active")
  async active(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
    await this.apiKeyService.active(apiKey);
    return;
  }

  @ApiKeyAdminInActiveDoc()
  @Response("apiKey.inactive")
  @ApiKeyAdminUpdateInActiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Patch("/update/:apiKey/inactive")
  async inActive(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
    await this.apiKeyService.inActive(apiKey);
    return;
  }

  @ApiKeyAdminCreateDoc()
  @Response("apiKey.create")
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @Post("/create")
  async create(@Body() body: ApiKeyCreateDto): Promise<IResponse> {
    const { doc, secret } = await this.apiKeyService.create(body);
    return {
      data: { _id: doc._id, key: doc.key, secret },
    };
  }

  @ApiKeyAdminDeleteDoc()
  @ApiKeyAdminDeleteGuard()
  @Response("apiKey.delete")
  @ApiKeyAdminDeleteGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Delete("/delete/:apiKey")
  async delete(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
    await this.apiKeyService.delete(apiKey);
    return;
  }

  @ApiKeyAdminUpdateNameDoc()
  @Response("apiKey.updateName", { serialization: ResponseIdSerialization })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @ApiKeyAdminUpdateGuard()
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Put("/update/:apiKey")
  async updateName(
    @GetApiKey() apiKey: ApiKeyDoc,
    @Body() dto: ApiKeyUpdateNameDto,
  ): Promise<IResponse> {
    await this.apiKeyService.updateName(apiKey, dto.name);
    return { data: { _id: apiKey._id } };
  }

  @ApiKeyAdminUpdateDoc()
  @Response("apiKey.updateDate", { serialization: ResponseIdSerialization })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @ApiKeyAdminUpdateGuard()
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Put("/update/:apiKey/date")
  async updateDate(
    @GetApiKey() apiKey: ApiKeyDoc,
    @Body() body: ApiKeyUpdateDateDto,
  ): Promise<IResponse> {
    await this.apiKeyService.updateDate(apiKey, body);
    return { data: { _id: apiKey._id } };
  }
}
