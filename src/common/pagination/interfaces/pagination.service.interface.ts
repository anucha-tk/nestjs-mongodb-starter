export interface IPaginationService {
  offset(page: number, perPage: number): number;
  page(page?: number): number;
  perPage(perPage?: number): number;
}
