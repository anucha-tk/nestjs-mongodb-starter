import { faker } from "@faker-js/faker";
import { ENUM_API_KEY_TYPE } from "src/common/api-key/constants/api-key.enum.constant";
import { ApiKeyCreateRawDto } from "src/common/api-key/dtos/api-key.create.dto";
import { IApiKeyCreated } from "src/common/api-key/interfaces/api-key.interface";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";

/**
 * ApiKeyFaker for Mock Testing
 */
export class ApiKeyFaker {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  /**
   * CreateApiKey.
   *
   * @param options Partial ApiKeyCreateRawDto
   * @param options.name Optional name string
   * @param options.key Optional key string
   * @param options.type Optional ENUM_API_KEY_TYPE
   * @param options.secret Optional secret string
   * @param options.startDate Optional startDate Date
   * @param options.endDate Optional endDate Date
   *
   * @returns Promise IApiKeyCreated
   */
  public async createApiKey({
    name,
    key,
    type,
    secret,
    startDate,
    endDate,
  }: Partial<ApiKeyCreateRawDto>): Promise<IApiKeyCreated> {
    return this.apiKeyService.createRaw({
      name: name ?? faker.word.words(),
      type: type ?? ENUM_API_KEY_TYPE.PUBLIC,
      key: key ?? faker.string.alphanumeric(20),
      secret: secret ?? faker.string.alphanumeric(20),
      startDate: startDate ?? faker.date.recent({ days: 7 }),
      endDate: endDate ?? faker.date.soon({ days: 30 }),
    });
  }

  /**
   * Get XApiKey.
   *
   * @param apiKeyCreated IApiKeyCreated eg.{ secret: string; doc: ApiKeyDoc; }
   * @returns string
   */
  public getXApiKey(apiKeyCreated: IApiKeyCreated): string {
    return `${apiKeyCreated.doc.key}:${apiKeyCreated.secret}`;
  }
}
