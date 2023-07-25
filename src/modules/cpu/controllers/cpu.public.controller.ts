import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import {
  PaginationQuery,
  PaginationMultiQueryOperators,
} from "src/common/pagination/decorators/pagination.decorator";
import { PaginationListDto } from "src/common/pagination/dtos/pagination.list.dto";
import { PaginationService } from "src/common/pagination/services/pagination.service";
import { RequestParamGuard } from "src/common/request/decorators/request.decorator";
import { Response, ResponsePaging } from "src/common/response/decorators/response.decorator";
import { IResponse, IResponsePaging } from "src/common/response/interfaces/response.interface";
import {
  CPU_DEFAULT_AVAILABLE_ORDER_BY,
  CPU_DEFAULT_AVAILABLE_SEARCH,
  CPU_DEFAULT_ORDER_BY,
  CPU_DEFAULT_ORDER_DIRECTION,
  CPU_DEFAULT_PER_PAGE,
} from "../constants/cpu.list.constant";
import { CPUPublicGetGuard, GetCPU } from "../decorators/cpu.public.decorator";
import { CPUPublicGetDoc, CPUPublicListDoc } from "../docs/cpu.public.doc";
import { CPURequestDto } from "../dtos/cpu.request.dto";
import { CPUEntity } from "../repository/entities/cpu.entity";
import { CPUGetSerialization } from "../serializations/cpu.get.serialization";
import { CPUListSerialization } from "../serializations/cpu.list.serialization";
import { CPUService } from "../services/cpu.service";

@ApiKeyPublicProtected()
@ApiTags("modules.public.cpu")
@Controller({
  version: "1",
  path: "/cpu",
})
export class CPUPublicController {
  constructor(
    private readonly cpuService: CPUService,
    private readonly paginationService: PaginationService,
  ) {}

  @CPUPublicListDoc()
  @ResponsePaging("cpu.list", { serialization: CPUListSerialization })
  @Get("/list")
  async list(
    @PaginationQuery(
      CPU_DEFAULT_PER_PAGE,
      CPU_DEFAULT_ORDER_BY,
      CPU_DEFAULT_ORDER_DIRECTION,
      CPU_DEFAULT_AVAILABLE_SEARCH,
      CPU_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationMultiQueryOperators()
    multiQueryOperators: Record<string, any>,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...multiQueryOperators,
    };

    const cpus: CPUEntity[] = await this.cpuService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.cpuService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: cpus,
    };
  }

  @CPUPublicGetDoc()
  @Response("cpu.get", { serialization: CPUGetSerialization })
  @CPUPublicGetGuard()
  @RequestParamGuard(CPURequestDto)
  @Get("/get/:cpu")
  async get(@GetCPU(true) cpu: CPUEntity): Promise<IResponse> {
    return { data: cpu };
  }

  // TODO: Get by id
  // TODO: search by brand
  // TODO: filter by marketStatus
  // TODO: search by codeName
}
