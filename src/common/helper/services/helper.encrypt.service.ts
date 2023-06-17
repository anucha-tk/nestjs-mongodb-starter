import { Injectable } from "@nestjs/common";
import { IHelperEncryptionService } from "../interfaces/helper.encryption-service.interface";
import { AES, enc, mode, pad } from "crypto-js";

@Injectable()
export class HelperEncryptionService implements IHelperEncryptionService {
  aes256Decrypt(
    encrypted: string,
    key: string,
    iv: string,
  ): string | Record<string, any> | Record<string, any>[] {
    const cIv = enc.Utf8.parse(iv);
    const cipher = AES.decrypt(encrypted, key, {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: cIv,
    });

    return JSON.parse(cipher.toString(enc.Utf8));
  }
}
