import { IHelperObjectService } from "../interfaces/helper.object-service.interface";

export class HelperObjectService implements IHelperObjectService {
  isJsonObject(value: any): value is Record<string, any> {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
  }
}
