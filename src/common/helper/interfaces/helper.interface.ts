import { ENUM_HELPER_DATE_FORMAT } from "../constants/helper.enum.constant";

export interface IHelperDateOptionsCreate {
  startOfDay?: boolean;
}

export interface IHelperDateOptionsFormat {
  format?: ENUM_HELPER_DATE_FORMAT | string;
}

export interface IHelperStringRandomOptions {
  upperCase?: boolean;
  safe?: boolean;
  prefix?: string;
}

export interface IHelperDateOptionsForward {
  fromDate?: Date;
}
