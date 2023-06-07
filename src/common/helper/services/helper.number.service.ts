import { Injectable } from "@nestjs/common";
import { IHelperNumberService } from "src/common/helper/interfaces/helper.number-service.interface";

@Injectable()
export class HelperNumberService implements IHelperNumberService {
  create(number: string): number {
    return Number(number);
  }
}
