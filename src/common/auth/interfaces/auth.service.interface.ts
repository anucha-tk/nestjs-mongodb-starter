import { IAuthPassword, IAuthPayloadOptions, IAuthRefreshTokenOptions } from "./auth.interface";

export interface IAuthService {
  getPayloadEncryption(): Promise<boolean>;
  encryptAccessToken(payload: Record<string, any>): Promise<string>;
  decryptAccessToken(payload: Record<string, any>): Promise<Record<string, any>>;
  createPassword(password: string): Promise<IAuthPassword>;
  validateUser(passwordString: string, passwordHash: string): Promise<boolean>;
  getTokenType(): Promise<string>;
  getAccessTokenExpirationTime(): Promise<number>;
  createPayloadAccessToken(data: Record<string, any>): Promise<Record<string, any>>;
  createPayloadRefreshToken(
    _id: string,
    options: IAuthPayloadOptions,
  ): Promise<Record<string, any>>;
  encryptRefreshToken(payload: Record<string, any>): Promise<string>;
  createAccessToken(payloadHashed: string | Record<string, any>): Promise<string>;
  createRefreshToken(
    payloadHashed: string | Record<string, any>,
    options?: IAuthRefreshTokenOptions,
  ): Promise<string>;
  checkPasswordExpired(passwordExpired: Date): Promise<boolean>;
}
