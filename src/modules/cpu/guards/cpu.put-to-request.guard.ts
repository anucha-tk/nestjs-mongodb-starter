import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { CPU_DELETED_META_KEY } from "../constants/cpu.constant";
import { CPUDoc } from "../repository/entities/cpu.entity";
import { CPUService } from "../services/cpu.service";

@Injectable()
export class CPUPutToRequestGuard implements CanActivate {
  constructor(private readonly cpuService: CPUService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestApp & { __cpu: CPUDoc }>();
    const withDeleted = this.reflector.getAllAndOverride<boolean>(CPU_DELETED_META_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { params } = request;
    const { cpu } = params;

    const check: CPUDoc = await this.cpuService.findOneById(cpu, {
      withDeleted,
    });
    request.__cpu = check;

    return true;
  }
}
