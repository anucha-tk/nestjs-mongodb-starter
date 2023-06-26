import { Query } from "@nestjs/common";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants/pagination.enum.constant";
import { PaginationFilterInBooleanPipe } from "../pipes/pagination.filter-in-boolean.pipe";
import { PaginationFilterInEnumPipe } from "../pipes/pagination.filter-in-enum.pipe";
import { PaginationOrderPipe } from "../pipes/pagination.order.pipe";
import { PaginationPagingPipe } from "../pipes/pagination.paging.pipe";
import { PaginationSearchPipe } from "../pipes/pagination.search.pipe";

export function PaginationQuery(
  defaultPerPage: number,
  defaultOrderBy: string,
  defaultOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
  availableSearch: string[],
  availableOrderBy: string[],
): ParameterDecorator {
  return Query(
    PaginationSearchPipe(availableSearch),
    PaginationPagingPipe(defaultPerPage),
    PaginationOrderPipe(defaultOrderBy, defaultOrderDirection, availableOrderBy),
  );
}

export function PaginationQueryFilterInBoolean(
  field: string,
  defaultValue: boolean[],
  queryField?: string,
  raw = false,
): ParameterDecorator {
  return Query(queryField ?? field, PaginationFilterInBooleanPipe(field, defaultValue, raw));
}

export function PaginationQueryFilterInEnum<T>(
  field: string,
  defaultValue: T,
  defaultEnum: Record<string, any>,
  queryField?: string,
  raw = false,
): ParameterDecorator {
  return Query(
    queryField ?? field,
    PaginationFilterInEnumPipe<T>(field, defaultValue, defaultEnum, raw),
  );
}
