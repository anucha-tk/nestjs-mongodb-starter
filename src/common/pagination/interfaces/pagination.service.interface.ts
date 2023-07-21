import { IPaginationOrder } from "./pagination.interface";

export interface IPaginationService {
  offset(page: number, perPage: number): number;
  page(page?: number): number;
  totalPage(totalData: number, perPage: number, maxPage: boolean): number;
  perPage(perPage?: number): number;
  search(searchValue?: string, availableSearch?: string[]): Record<string, any> | undefined;
  order(
    orderByValue?: string,
    orderDirectionValue?: string,
    availableOrderBy?: string[],
  ): IPaginationOrder;
  filterIn<T = string>(field: string, filterValue: T[]): Record<string, { $in: T[] }>;
  filterEqual<T = string>(field: string, filterValue: T): Record<string, T>;
  filterContain(
    field: string,
    filterValue: string,
  ): Record<string, { $regex: RegExp; $options: string }>;
  filterContainFullMatch(
    field: string,
    filterValue: string,
  ): Record<string, { $regex: RegExp; $options: string }>;
}
