import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ISettingService } from "../interfaces/setting.service.interface";

@Injectable()
export class SettingService implements ISettingService {
  private readonly passwordAttempt: boolean;
  private readonly maxPasswordAttempt: number;

  constructor(private readonly configService: ConfigService) {
    this.passwordAttempt = this.configService.get<boolean>("auth.password.attempt");
    this.maxPasswordAttempt = this.configService.get<number>("auth.password.maxAttempt");
  }

  async getPasswordAttempt(): Promise<boolean> {
    return this.passwordAttempt;
  }

  async getMaxPasswordAttempt(): Promise<number> {
    return this.maxPasswordAttempt;
  }
}
