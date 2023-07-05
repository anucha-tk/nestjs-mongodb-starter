import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { ClassTransformOptions } from "class-transformer";
import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
  RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from "../constants/response.constant";
import { ResponseDefaultInterceptor } from "../interceptors/response.default.interceptor";
import { ResponsePagingInterceptor } from "../interceptors/response.paging.interceptor";
import { IResponseOptions, IResponsePagingOptions } from "../interfaces/response.interface";
import { ResponseIdSerialization } from "../serializations/response.id.serialization";

export function Response<T>(messagePath: string, options?: IResponseOptions<T>): MethodDecorator {
  return applyDecorators(
    UseInterceptors(ResponseDefaultInterceptor<T>),
    SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
    SetMetadata(RESPONSE_MESSAGE_PROPERTIES_META_KEY, options?.messageProperties),
  );
}

/**
 * ResponseId
 * @UseInterceptors ResponseIdSerialization
 * @returns response object with id only
 * */
export function ResponseId<T>(messagePath: string, options?: IResponseOptions<T>): MethodDecorator {
  return applyDecorators(
    UseInterceptors(ResponseDefaultInterceptor<T>),
    SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, ResponseIdSerialization),
    SetMetadata(RESPONSE_MESSAGE_PROPERTIES_META_KEY, options?.messageProperties),
    SetMetadata(RESPONSE_SERIALIZATION_OPTIONS_META_KEY, {
      strategy: "excludeAll",
    } as ClassTransformOptions),
  );
}

export function ResponsePaging<T>(
  messagePath: string,
  options: IResponsePagingOptions<T>,
): MethodDecorator {
  return applyDecorators(
    UseInterceptors(ResponsePagingInterceptor<T>),
    SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
    SetMetadata(RESPONSE_MESSAGE_PROPERTIES_META_KEY, options?.messageProperties),
  );
}
