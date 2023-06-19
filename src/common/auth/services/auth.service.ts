import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { HelperEncryptionService } from "src/common/helper/services/helper.encrypt.service";
import { HelperHashService } from "src/common/helper/services/helper.hash.service";
import { IAuthPassword } from "../interfaces/auth.interface";
import { IAuthService } from "../interfaces/auth.service.interface";

@Injectable()
export class AuthService implements IAuthService {
  // access
  private readonly accessTokenEncryptKey: string;
  private readonly accessTokenEncryptIv: string;

  // refresh
  // payload
  private readonly payloadEncryption: boolean;
  private readonly prefixAuthorization: string;

  // password
  private readonly passwordExpiredIn: number;
  private readonly passwordSaltLength: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly helperEncryptionService: HelperEncryptionService,
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
  ) {
    this.accessTokenEncryptKey = this.configService.get<string>("auth.accessToken.encryptKey");
    this.accessTokenEncryptIv = this.configService.get<string>("auth.accessToken.encryptIv");

    this.payloadEncryption = this.configService.get<boolean>("auth.payloadEncryption");
    this.prefixAuthorization = this.configService.get<string>("auth.prefixAuthorization");

    this.passwordExpiredIn = this.configService.get<number>("auth.password.expiredIn");
    this.passwordSaltLength = this.configService.get<number>("auth.password.saltLength");
  }

  async getPayloadEncryption(): Promise<boolean> {
    return this.payloadEncryption;
  }

  async encryptAccessToken(payload: Record<string, any>): Promise<string> {
    return this.helperEncryptionService.aes256Encrypt(
      payload,
      this.accessTokenEncryptKey,
      this.accessTokenEncryptIv,
    );
  }

  async decryptAccessToken({ data }: Record<string, any>): Promise<Record<string, any>> {
    return this.helperEncryptionService.aes256Decrypt(
      data,
      this.accessTokenEncryptKey,
      this.accessTokenEncryptIv,
    ) as Record<string, any>;
  }

  async createSalt(length: number): Promise<string> {
    return this.helperHashService.randomSalt(length);
  }

  async createPassword(password: string): Promise<IAuthPassword> {
    const salt: string = await this.createSalt(this.passwordSaltLength);

    const passwordExpired: Date = this.helperDateService.forwardInSeconds(this.passwordExpiredIn);
    const passwordCreated: Date = this.helperDateService.create();
    const passwordHash = this.helperHashService.bcrypt(password, salt);
    return {
      passwordHash,
      passwordExpired,
      passwordCreated,
      salt,
    };
  }

  async validateUser(passwordString: string, passwordHash: string): Promise<boolean> {
    return this.helperHashService.bcryptCompare(passwordString, passwordHash);
  }

  async getTokenType(): Promise<string> {
    return this.prefixAuthorization;
  }
}
