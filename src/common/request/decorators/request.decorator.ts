import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { IResult } from "ua-parser-js";
import {
  REQUEST_CUSTOM_TIMEOUT_META_KEY,
  REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
  REQUEST_PARAM_CLASS_DTOS_META_KEY,
} from "../constants/request.constant";
import { RequestParamRawGuard } from "../guards/request.param.guard";
import { IRequestApp } from "../interfaces/request.interface";

export function RequestTimeout(seconds: string): MethodDecorator {
  return applyDecorators(
    SetMetadata(REQUEST_CUSTOM_TIMEOUT_META_KEY, true),
    SetMetadata(REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY, seconds),
  );
}

export const RequestUserAgent: () => ParameterDecorator = createParamDecorator(
  (_: string, ctx: ExecutionContext): IResult => {
    const { __userAgent } = ctx.switchToHttp().getRequest<IRequestApp>();
    return __userAgent;
  },
);

/**
 * Guard params from request with classValidation
 * @example
 * `@RequestParamGuard(UserRequestDto)` - check param is uuid
 * @throws `ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR`
 * @returns MethodDecorator
 * */
export function RequestParamGuard(...classValidation: ClassConstructor<any>[]): MethodDecorator {
  return applyDecorators(
    UseGuards(RequestParamRawGuard),
    SetMetadata(REQUEST_PARAM_CLASS_DTOS_META_KEY, classValidation),
  );
}
