import { HttpStatus } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
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
  serialization?: ClassConstructor<T>;
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
