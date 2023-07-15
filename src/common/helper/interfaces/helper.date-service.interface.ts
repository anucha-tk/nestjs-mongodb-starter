import {
  IHelperDateOptionsBackward,
  IHelperDateOptionsCreate,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
} from "./helper.interface";

export interface IHelperDateService {
  create(date?: string | number | Date, options?: IHelperDateOptionsCreate): Date;
  format(date: Date, options?: IHelperDateOptionsFormat): string;
  timestamp(date?: string | number | Date, options?: IHelperDateOptionsCreate): number;
  startOfDay(date?: Date): Date;
  endOfDay(date?: Date): Date;
  forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date;
  backwardInDays(days: number, options?: IHelperDateOptionsBackward): Date;
}
