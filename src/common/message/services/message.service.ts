import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IMessageService } from "../interfaces/message.service.interface";

@Injectable()
export class MessageService implements IMessageService {
  private readonly appDefaultLanguage: string;
  private readonly appDefaultAvailableLanguage: string[];

  constructor(private readonly configService: ConfigService) {
    this.appDefaultLanguage = this.configService.get<string>("message.language");
    this.appDefaultAvailableLanguage = this.configService.get<string[]>(
      "message.availableLanguage",
    );
  }

  getAvailableLanguages(): string[] {
    return this.appDefaultAvailableLanguage;
  }

  getLanguage(): string {
    return this.appDefaultLanguage;
  }
}
