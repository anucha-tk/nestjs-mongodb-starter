import { Inject, Injectable, mixin, Type, UnprocessableEntityException } from "@nestjs/common";
import { PipeTransform, Scope } from "@nestjs/common/interfaces";
import { REQUEST } from "@nestjs/core";
import { PaginationService } from "src/common/pagination/services/pagination.service";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "src/common/request/constants/request.status-code.constant";
import { IRequestApp } from "src/common/request/interfaces/request.interface";

export function PaginationMultiQueryOperatorsPipe(): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationQueryOperatorPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService,
    ) {}

    async transform(values?: string): Promise<Record<string, any>> {
      if (!values) return;

      let queryParse: Record<string, any>[];

      try {
        queryParse = JSON.parse(values);
      } catch (error) {
        throw new UnprocessableEntityException({
          statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
          message: "request.queryOperators",
        });
      }
      return this.paginationService.multiQueryOperator(queryParse);
    }
  }

  return mixin(MixinPaginationQueryOperatorPipe);
}
