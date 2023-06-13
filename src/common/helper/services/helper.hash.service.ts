import { Injectable } from "@nestjs/common";
import { IHelperHashService } from "../interfaces/helper.hash-service.interface";
import { SHA256, enc } from "crypto-js";

@Injectable()
export class HelperHashService implements IHelperHashService {
  sha256(string: string): string {
    return SHA256(string).toString(enc.Hex);
  }
}
