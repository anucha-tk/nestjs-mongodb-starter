import { Injectable } from "@nestjs/common";
import { IHelperHashService } from "../interfaces/helper.hash-service.interface";
import { SHA256, enc } from "crypto-js";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

@Injectable()
export class HelperHashService implements IHelperHashService {
  sha256(string: string): string {
    return SHA256(string).toString(enc.Hex);
  }
  sha256Compare(hashOne: string, hashTwo: string): boolean {
    return hashOne === hashTwo;
  }

  randomSalt(length: number): string {
    return genSaltSync(length);
  }

  bcrypt(passwordString: string, salt: string): string {
    return hashSync(passwordString, salt);
  }

  bcryptCompare(passwordString: string, passwordHashed: string): boolean {
    return compareSync(passwordString, passwordHashed);
  }
}
