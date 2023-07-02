import {
  ENUM_PAGINATION_FILTER_CASE_OPTIONS,
  ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS,
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
} from "src/common/pagination/constants/pagination.enum.constant";

export type IPaginationOrder = Record<string, ENUM_PAGINATION_ORDER_DIRECTION_TYPE>;

/**
 * Pagination paging Options
 */
export interface IPaginationPaging {
  /**
   * number limit paging
   * */
  limit: number;
  /**
   * number offset paging
   * */
  offset: number;
}

/**
 * pagination Options
 */
export interface IPaginationOptions {
  /**
   * Optional paging object
   * - paging.limit number for limit pagination
   * - paging.offset number for offset pagination
   * @example
   *    paging = { limit: 20, offset: 10 }
   */
  paging?: IPaginationPaging;
  /**
   * Optional order object Record<string,ENUM_PAGINATION_ORDER_DIRECTION_TYPE>.
   * @example
   *    order = { name: "asc" }
   *    order = { name: "desc" }
   */
  order?: IPaginationOrder;
}

export interface IPaginationFilterDateOptions {
  time?: ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS;
}

export interface IPaginationFilterStringContainOptions {
  case?: ENUM_PAGINATION_FILTER_CASE_OPTIONS;
  trim?: boolean;
  fullMatch?: boolean;
}

export interface IPaginationFilterStringEqualOptions extends IPaginationFilterStringContainOptions {
  isNumber?: boolean;
}
