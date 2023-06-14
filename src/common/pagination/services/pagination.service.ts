import { Injectable } from "@nestjs/common";
import {
  PAGINATION_MAX_PAGE,
  PAGINATION_MAX_PER_PAGE,
  PAGINATION_PAGE,
  PAGINATION_PER_PAGE,
} from "../constants/pagination.constant";
import { IPaginationService } from "../interfaces/pagination.service.interface";

@Injectable()
export class PaginationService implements IPaginationService {
  offset(page: number, perPage: number): number {
    page = page > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : page;
    perPage = perPage > PAGINATION_MAX_PER_PAGE ? PAGINATION_MAX_PER_PAGE : perPage;
    const offset: number = (page - 1) * perPage;

    return offset;
  }

  page(page?: number): number {
    return page ? (page > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : page) : PAGINATION_PAGE;
  }

  perPage(perPage?: number): number {
    return perPage
      ? perPage > PAGINATION_MAX_PER_PAGE
        ? PAGINATION_MAX_PER_PAGE
        : perPage
      : PAGINATION_PER_PAGE;
  }
}
