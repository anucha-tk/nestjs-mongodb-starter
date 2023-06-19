import { IAuthPassword } from "./auth.interface";

export interface IAuthService {
  getPayloadEncryption(): Promise<boolean>;
  encryptAccessToken(payload: Record<string, any>): Promise<string>;
  decryptAccessToken(payload: Record<string, any>): Promise<Record<string, any>>;
  createPassword(password: string): Promise<IAuthPassword>;
  validateUser(passwordString: string, passwordHash: string): Promise<boolean>;
  getTokenType(): Promise<string>;
}
