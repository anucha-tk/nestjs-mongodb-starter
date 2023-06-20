export interface IHelperArrayService {
  filterIncludeUniqueByArray<T>(a: T[], b: T[]): T[];
  includes<T>(a: T[], b: T): boolean;
  unique<T>(array: T[]): T[];
  isJsonArray(value: any): value is Record<string, any>[];
}
