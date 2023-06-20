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
