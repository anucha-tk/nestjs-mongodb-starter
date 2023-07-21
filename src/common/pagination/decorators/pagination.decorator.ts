import { Query } from "@nestjs/common";
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "../constants/pagination.enum.constant";
import { IPaginationFilterStringContainOptions } from "../interfaces/pagination.interface";
import { PaginationFilterContainPipe } from "../pipes/pagination.filter-contain.pipe";
import { PaginationFilterEqualObjectIdPipe } from "../pipes/pagination.filter-equal-object-id.pipe";
import { PaginationFilterInBooleanPipe } from "../pipes/pagination.filter-in-boolean.pipe";
import { PaginationFilterInEnumPipe } from "../pipes/pagination.filter-in-enum.pipe";
import { PaginationJoinPipe } from "../pipes/pagination.join.pipe";
import { PaginationOrderPipe } from "../pipes/pagination.order.pipe";
import { PaginationPagingPipe } from "../pipes/pagination.paging.pipe";
import { PaginationSearchPipe } from "../pipes/pagination.search.pipe";

export function PaginationQuery(
  defaultPerPage: number,
  defaultOrderBy: string,
  defaultOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
  availableSearch: string[],
  availableOrderBy: string[],
  maxPage = false,
): ParameterDecorator {
  return Query(
    PaginationSearchPipe(availableSearch),
    PaginationPagingPipe(defaultPerPage, maxPage),
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

/**
 * Pagination query filter objectId.
 *
 * @param field field string for query
 * @param queryField name string of single property to extract from the `query` object
 * @param raw boolean return raw type
 */
export function PaginationQueryFilterEqualObjectId(
  field: string,
  queryField?: string,
  raw = false,
): ParameterDecorator {
  return Query(queryField ?? field, PaginationFilterEqualObjectIdPipe(field, raw));
}

/**
 * Pagination query boolean
 *
 * @param queryField name string of single property to extract from the `query` object
 * @param defaultValue boolean
 *
 * @example
 *    `@PaginationQueryBoolean({ defaultValue: false })`
 *    join: boolean,
 *
 *    `@PaginationQueryBoolean({ defaultValue: false })`
 *    withDeleted: boolean,
 */
export function PaginationQueryBoolean({
  queryField,
  defaultValue,
}: {
  queryField: string;
  defaultValue: boolean;
}): ParameterDecorator {
  return Query(queryField, PaginationJoinPipe(defaultValue));
}

export function PaginationQueryFilterContain(
  field: string,
  queryField?: string,
  options?: IPaginationFilterStringContainOptions,
  raw = false,
): ParameterDecorator {
  return Query(queryField ?? field, PaginationFilterContainPipe(field, raw, options));
}
