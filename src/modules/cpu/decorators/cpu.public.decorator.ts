import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";
import { IRequestApp } from "src/common/request/interfaces/request.interface";
import { CPUNotFoundGuard } from "../guards/cpu.not-found.guard";
import { CPUPutToRequestGuard } from "../guards/cpu.put-to-request.guard";
import { CPUDoc, CPUEntity } from "../repository/entities/cpu.entity";

/**
 * Decorator get cpu from `request.__cpu`
 *
 * @param returnPlain if true return toObject
 * @returns MethodDecorator
 * */
export const GetCPU = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): CPUDoc | CPUEntity => {
    const { __cpu } = ctx.switchToHttp().getRequest<IRequestApp & { __cpu: CPUDoc }>();
    return returnPlain ? __cpu.toObject() : __cpu;
  },
);

export function CPUPublicGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(CPUPutToRequestGuard, CPUNotFoundGuard));
}
