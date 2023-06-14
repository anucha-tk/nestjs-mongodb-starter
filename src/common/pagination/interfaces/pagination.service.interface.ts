import { IPaginationOrder } from "./pagination.interface";

export interface IPaginationService {
  offset(page: number, perPage: number): number;
  page(page?: number): number;
  totalPage(totalData: number, perPage: number): number;
  perPage(perPage?: number): number;
  search(searchValue?: string, availableSearch?: string[]): Record<string, any> | undefined;
  order(
    orderByValue?: string,
    orderDirectionValue?: string,
    availableOrderBy?: string[],
  ): IPaginationOrder;
}
