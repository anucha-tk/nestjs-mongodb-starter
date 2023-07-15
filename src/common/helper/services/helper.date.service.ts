import { Injectable } from "@nestjs/common";
import { IHelperDateService } from "../interfaces/helper.date-service.interface";
import {
  IHelperDateOptionsBackward,
  IHelperDateOptionsCreate,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
} from "../interfaces/helper.interface";
import moment from "moment";
import { ENUM_HELPER_DATE_FORMAT } from "../constants/helper.enum.constant";

@Injectable()
export class HelperDateService implements IHelperDateService {
  /**
   * @description create timestamp
   * @param options if use startOfDay, just call startOf('day')
   * @returns valueOf number
   * */
  timestamp(date?: string | number | Date, options?: IHelperDateOptionsCreate): number {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) {
      mDate.startOf("day");
    }

    return mDate.valueOf();
  }

  /**
   * @description change format
   * @default format YYYY-MM-DD
   * @param options format eg.YYYY, MM, DD
   * @returns string
   * */
  format(date: Date, options?: IHelperDateOptionsFormat): string {
    return moment(date).format(options?.format ?? ENUM_HELPER_DATE_FORMAT.DATE);
  }

  create(date?: string | number | Date, options?: IHelperDateOptionsCreate): Date {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) {
      mDate.startOf("day");
    }

    return mDate.toDate();
  }

  startOfDay(date?: Date): Date {
    return moment(date).startOf("day").toDate();
  }

  endOfDay(date?: Date): Date {
    return moment(date).endOf("day").toDate();
  }

  forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(seconds, "s").toDate();
  }

  backwardInDays(days: number, options?: IHelperDateOptionsBackward): Date {
    return moment(options?.fromDate).subtract(days, "d").toDate();
  }
}
