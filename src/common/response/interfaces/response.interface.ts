import { HttpStatus } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { ENUM_HELPER_FILE_TYPE } from "src/common/helper/constants/helper.enum.constant";
import { IHelperFileRows } from "src/common/helper/interfaces/helper.interface";
import { IMessageOptionsProperties } from "src/common/message/interfaces/message.interface";

export interface IResponseCustomPropertyMetadata {
  statusCode?: number;
  message?: string;
  httpStatus?: HttpStatus;
  messageProperties?: IMessageOptionsProperties;
}

// metadata
export interface IResponseMetadata {
  customProperty?: IResponseCustomPropertyMetadata;
  [key: string]: any;
}

// type
export interface IResponse {
  _metadata?: IResponseMetadata;
  data?: Record<string, any>;
}

// decorator options
export interface IResponseOptions<T> {
  /**
   * serialization response ClassConstructor
   * @example
   * {
   *    serialization: AppSerialization
   * }
   * */
  serialization?: ClassConstructor<T>;
  /**
   * message property `Record<string, string | number>`
   * @example
   * # How to use
   * ## assign serviceName property
   *    {
   *      serialization: ...,
   *      messageProperties: { serviceName: "app" },
   *    }
   * ## set `{serviceName}` to json languages
   *    {
   *      "hello": "This is test endpoint service {serviceName}.",
   *    }
   *
   * */
  messageProperties?: IMessageOptionsProperties;
}

export type IResponseIdOptions = Omit<IResponseOptions<any>, "serialization">;

export interface IResponsePagingOptions<T> extends Omit<IResponseOptions<T>, "serialization"> {
  serialization: ClassConstructor<T>;
}

export interface IResponsePagingPagination {
  totalPage: number;
  total: number;
}

export interface IResponsePaging {
  _metadata?: IResponseMetadata;
  _pagination: IResponsePagingPagination;
  data: Record<string, any>[];
}

export interface IResponseFileOptions<T> extends IResponseOptions<T> {
  /** file type eg. CSV*/
  fileType?: ENUM_HELPER_FILE_TYPE;
}

export interface IResponseFile {
  data: IHelperFileRows[];
}
