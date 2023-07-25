import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "src/common/pagination/constants/pagination.enum.constant";

export const CPU_DEFAULT_PER_PAGE = 10;
export const CPU_DEFAULT_ORDER_BY = "launchDate";
export const CPU_DEFAULT_ORDER_DIRECTION = ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const CPU_DEFAULT_AVAILABLE_ORDER_BY = [
  "cpuName",
  "productCollection",
  "codeName",
  "brand",
  "processorNumber",
  "lithography",
  "price",
  "totalCores",
  "totalThreads",
  "maxTurboFrequency",
  "processorBaseFrequency",
  "cache",
  "tdp",
  "marketingStatus",
  "launchDate",
  "socketsSupported",
];
export const CPU_DEFAULT_AVAILABLE_SEARCH = [
  "cpuName",
  "productCollection",
  "codeName",
  "processorNumber",
  "socketsSupported",
];
