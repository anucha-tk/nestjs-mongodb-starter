import { Injectable, CanActivate, ExecutionContext, NotFoundException } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { ENUM_CPU_STATUS_CODE_ERROR } from "../constants/cpu.status-code.constant";
import { CPUDoc } from "../repository/entities/cpu.entity";

/**
 * Guard 404 when `request.__cpu` not exist
 * */
@Injectable()
export class CPUNotFoundGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __cpu } = context.switchToHttp().getRequest<IRequestApp & { __cpu: CPUDoc }>();

    if (!__cpu) {
      throw new NotFoundException({
        statusCode: ENUM_CPU_STATUS_CODE_ERROR.CPU_NOT_FOUND_ERROR,
        message: "cpu.error.notFound",
      });
    }

    return true;
  }
}
