import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import { PaginationQuery } from "src/common/pagination/decorators/pagination.decorator";
import { PaginationListDto } from "src/common/pagination/dtos/pagination.list.dto";
import { PaginationService } from "src/common/pagination/services/pagination.service";
import { ResponsePaging } from "src/common/response/decorators/response.decorator";
import { IResponsePaging } from "src/common/response/interfaces/response.interface";
import {
  CPU_DEFAULT_AVAILABLE_ORDER_BY,
  CPU_DEFAULT_AVAILABLE_SEARCH,
  CPU_DEFAULT_ORDER_BY,
  CPU_DEFAULT_ORDER_DIRECTION,
  CPU_DEFAULT_PER_PAGE,
} from "../constants/cpu.list.constant";
import { CPUAdminListDoc } from "../docs/cpu.public.doc";
import { CPUEntity } from "../repository/entities/cpu.entity";
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

  @CPUAdminListDoc()
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
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
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
}
