import { Inject, Injectable, mixin, Type } from "@nestjs/common";
import { PipeTransform, Scope } from "@nestjs/common/interfaces";
import { REQUEST } from "@nestjs/core";
import { IRequestApp } from "src/common/request/interfaces/request.interface";

export function PaginationJoinPipe(defaultValue: boolean): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationFilterInBooleanPipe implements PipeTransform {
    constructor(@Inject(REQUEST) protected readonly request: IRequestApp) {}

    async transform(value: boolean): Promise<boolean> {
      let finalValue: boolean = defaultValue;
      if (value) finalValue = value;

      return finalValue;
    }
  }

  return mixin(MixinPaginationFilterInBooleanPipe);
}
