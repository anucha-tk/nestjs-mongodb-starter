import _ from "lodash";
import { IHelperArrayService } from "../interfaces/helper.array-service.interface";

export class HelperArrayService implements IHelperArrayService {
  filterIncludeUniqueByArray<T>(a: T[], b: T[]): T[] {
    return _.intersection(a, b);
  }
}
