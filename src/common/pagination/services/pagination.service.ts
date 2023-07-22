import { Injectable } from "@nestjs/common";
import {
  PAGINATION_AVAILABLE_ORDER_BY,
  PAGINATION_MAX_PAGE,
  PAGINATION_MAX_PER_PAGE,
  PAGINATION_ORDER_BY,
  PAGINATION_ORDER_DIRECTION,
  PAGINATION_PAGE,
  PAGINATION_PER_PAGE,
} from "../constants/pagination.constant";
import { IPaginationOrder } from "../interfaces/pagination.interface";
import { IPaginationService } from "../interfaces/pagination.service.interface";

@Injectable()
export class PaginationService implements IPaginationService {
  offset(page: number, perPage: number, maxPage = false): number {
    if (maxPage) {
      page = page > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : page;
      perPage = perPage > PAGINATION_MAX_PER_PAGE ? PAGINATION_MAX_PER_PAGE : perPage;
    }
    const offset: number = (page - 1) * perPage;

    return offset;
  }

  page(page?: number, maxPage = false): number {
    return page
      ? maxPage && page > PAGINATION_MAX_PAGE
        ? PAGINATION_MAX_PAGE
        : page
      : PAGINATION_PAGE;
  }

  perPage(perPage?: number): number {
    return perPage
      ? perPage > PAGINATION_MAX_PER_PAGE
        ? PAGINATION_MAX_PER_PAGE
        : perPage
      : PAGINATION_PER_PAGE;
  }

  search(searchValue = "", availableSearch: string[]): Record<string, any> | undefined {
    if (!searchValue) return undefined;

    return {
      $or: availableSearch.map((val) => ({
        [val]: {
          $regex: new RegExp(searchValue),
          $options: "i",
        },
      })),
    };
  }

  order(
    orderByValue = PAGINATION_ORDER_BY,
    orderDirectionValue = PAGINATION_ORDER_DIRECTION,
    availableOrderBy = PAGINATION_AVAILABLE_ORDER_BY,
  ): IPaginationOrder {
    const orderBy: string = availableOrderBy.includes(orderByValue)
      ? orderByValue
      : PAGINATION_ORDER_BY;

    return { [orderBy]: orderDirectionValue };
  }

  /**
   * get total page
   * @param totalData number of totalData
   * @param perPage number of perPage
   * @param maxPage Optional default false, if what to maxPage enable true
   *
   * @returns number of total page
   * */
  totalPage(totalData: number, perPage: number, maxPage = false): number {
    let totalPage = Math.ceil(totalData / perPage);
    totalPage = totalPage === 0 ? 1 : totalPage;
    return maxPage && totalPage > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : totalPage;
  }

  /**
   * return object filter in
   *
   * @example
   * paginationService.filterIn('name', ['name_a', 'name_b']) // { name: { '$in': ['name_a', 'name_b']}}
   *
   * @returns Record<string, { $in: T[] }>
   * */
  filterIn<T = string>(field: string, filterValue: T[]): Record<string, { $in: T[] }> {
    return {
      [field]: {
        $in: filterValue,
      },
    };
  }

  /**
   * return object filter equal
   *
   * @example
   * paginationService.filterEqual('role', 'c2529516-2960-4705-93cd-21ee0b8c8c05')
   * // { role: : 'c2529516-2960-4705-93cd-21ee0b8c8c05'}
   *
   * @returns Record<string, T>
   * */
  filterEqual<T = string>(field: string, filterValue: T): Record<string, T> {
    return { [field]: filterValue };
  }

  filterContainFullMatch(
    field: string,
    filterValue: string,
  ): Record<string, { $regex: RegExp; $options: string }> {
    return {
      [field]: {
        $regex: new RegExp(`\\b${filterValue}\\b`),
        $options: "i",
      },
    };
  }

  filterContain(
    field: string,
    filterValue: string,
  ): Record<string, { $regex: RegExp; $options: string }> {
    return {
      [field]: {
        $regex: new RegExp(filterValue),
        $options: "i",
      },
    };
  }

  /**
   * get multi query operators mongo
   *
   * @example queryOperator({ field: "totalCores", operator: "=", value: "24" })
   * //{ totalCores: { $eq: "24" }}
   *
   * @returns Record<string,any>
   * */
  multiQueryOperator(queryOperators: Record<string, any>[]): Record<string, any> {
    const opeObj = {};
    queryOperators.map((e: any) => {
      switch (e.operator) {
        case "=":
          opeObj[e.field] = { ...opeObj[e.field], $eq: e.value };
          break;
        case ">":
          opeObj[e.field] = { ...opeObj[e.field], $gt: e.value };
          break;
        case ">=":
          opeObj[e.field] = { ...opeObj[e.field], $gte: e.value };
          break;
        case "<":
          opeObj[e.field] = { ...opeObj[e.field], $lt: e.value };
          break;
        case "<=":
          opeObj[e.field] = { ...opeObj[e.field], $lte: e.value };
          break;
        case "!=":
          opeObj[e.field] = { ...opeObj[e.field], $ne: e.value };
          break;
      }
    });
    return opeObj;
  }
}
