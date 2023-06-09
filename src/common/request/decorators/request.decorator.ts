import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { IResult } from "ua-parser-js";
import {
  REQUEST_CUSTOM_TIMEOUT_META_KEY,
  REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
} from "../constants/request.constant";
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
