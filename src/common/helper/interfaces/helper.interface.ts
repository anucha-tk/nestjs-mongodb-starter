import { ENUM_HELPER_DATE_FORMAT, ENUM_HELPER_FILE_TYPE } from "../constants/helper.enum.constant";

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

// Helper Encryption
export interface IHelperJwtVerifyOptions {
  audience: string;
  issuer: string;
  subject: string;
  secretKey: string;
}

export interface IHelperJwtOptions extends IHelperJwtVerifyOptions {
  expiredIn: number | string;
  notBefore?: number | string;
}

// file
export type IHelperFileRows = Record<string, string | number | Date>;

export interface IHelperFileCreateExcelWorkbookOptions {
  sheetName?: string;
}

export interface IHelperFileWriteExcelOptions {
  password?: string;
  type?: ENUM_HELPER_FILE_TYPE;
}

export interface IHelperFileReadExcelOptions {
  sheet?: string | number;
  password?: string;
}

export type IHelperDateOptionsBackward = IHelperDateOptionsForward;
