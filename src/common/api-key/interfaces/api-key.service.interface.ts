import { IDatabaseFindOneOptions } from "src/common/database/interfaces/database.interface";
import { ApiKeyCreateDto, ApiKeyCreateRawDto } from "../dtos/api-key.create.dto";
import { ApiKeyDoc } from "../repository/entities/api-key.entity";
import { IApiKeyCreated } from "./api-key.interface";

export interface IApiKeyService {
  findOneByActiveKey(key: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc>;
  validateHashApiKey(hashFromRequest: string, hash: string): Promise<boolean>;
  createKey(): Promise<string>;
  createSecret(): Promise<string>;
  createHashApiKey(key: string, secret: string): Promise<string>;
  create({ name, type, startDate, endDate }: ApiKeyCreateDto): Promise<IApiKeyCreated>;
  createRaw({ name, key, secret, startDate, endDate }: ApiKeyCreateRawDto): Promise<IApiKeyCreated>;
}
