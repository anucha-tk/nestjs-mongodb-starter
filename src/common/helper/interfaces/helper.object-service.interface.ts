export interface IHelperObjectService {
  isJsonObject(value: any): value is Record<string, any>;
}
