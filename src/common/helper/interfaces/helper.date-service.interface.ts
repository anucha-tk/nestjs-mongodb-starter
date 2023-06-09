import { IHelperDateOptionsCreate, IHelperDateOptionsFormat } from "./helper.interface";

export interface IHelperDateService {
  create(date?: string | number | Date, options?: IHelperDateOptionsCreate): Date;
  format(date: Date, options?: IHelperDateOptionsFormat): string;
  timestamp(date?: string | number | Date, options?: IHelperDateOptionsCreate): number;
}
