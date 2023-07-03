import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { HelperHashService } from "src/common/helper/services/helper.hash.service";
import { HelperStringService } from "src/common/helper/services/helper.string.service";
import { ApiKeyCreateDto, ApiKeyCreateRawDto } from "../dtos/api-key.create.dto";
import { ApiKeyUpdateDateDto } from "../dtos/api-key.update-date.dto";
import { IApiKeyCreated } from "../interfaces/api-key.interface";
import { IApiKeyService } from "../interfaces/api-key.service.interface";
import { ApiKeyDoc, ApiKeyEntity } from "../repository/entities/api-key.entity";
import { ApiKeyRepository } from "../repository/repositories/api-key.repository";

@Injectable()
export class ApiKeyService implements IApiKeyService {
  private readonly env: string;

  constructor(
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly helperStringService: HelperStringService,
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
  ) {
    this.env = this.configService.get<string>("app.env");
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.findAll<ApiKeyEntity>(find, options);
  }

  async findOneByActiveKey(key: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>({ key, isActive: true }, options);
  }

  async findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOneById<ApiKeyDoc>(_id, options);
  }

  async createKey(): Promise<string> {
    return this.helperStringService.random(25, {
      safe: false,
      upperCase: true,
      prefix: `${this.env}_`,
    });
  }

  async createSecret(): Promise<string> {
    return this.helperStringService.random(35, {
      safe: false,
      upperCase: true,
    });
  }

  async createHashApiKey(key: string, secret: string): Promise<string> {
    return this.helperHashService.sha256(`${key}:${secret}`);
  }

  async validateHashApiKey(hashFromRequest: string, hash: string): Promise<boolean> {
    return this.helperHashService.sha256Compare(hashFromRequest, hash);
  }

  async create({ name, type, startDate, endDate }: ApiKeyCreateDto): Promise<IApiKeyCreated> {
    const key = await this.createKey();
    const secret = await this.createSecret();
    const hash: string = await this.createHashApiKey(key, secret);

    const dto: ApiKeyEntity = new ApiKeyEntity();
    dto.name = name;
    dto.key = key;
    dto.hash = hash;
    dto.isActive = true;
    dto.type = type;

    if (startDate && endDate) {
      dto.startDate = this.helperDateService.startOfDay(startDate);
      dto.endDate = this.helperDateService.endOfDay(endDate);
    }

    const created: ApiKeyDoc = await this.apiKeyRepository.create<ApiKeyEntity>(dto);

    return { doc: created, secret };
  }

  async createRaw({
    name,
    key,
    type,
    secret,
    startDate,
    endDate,
  }: ApiKeyCreateRawDto): Promise<IApiKeyCreated> {
    const hash: string = await this.createHashApiKey(key, secret);

    const dto: ApiKeyEntity = new ApiKeyEntity();
    dto.name = name;
    dto.key = key;
    dto.hash = hash;
    dto.isActive = true;
    dto.type = type;

    if (startDate && endDate) {
      dto.startDate = this.helperDateService.startOfDay(startDate);
      dto.endDate = this.helperDateService.endOfDay(endDate);
    }

    const created: ApiKeyDoc = await this.apiKeyRepository.create<ApiKeyEntity>(dto);

    return { doc: created, secret };
  }

  async deleteMany(find: Record<string, any>): Promise<boolean> {
    return this.apiKeyRepository.deleteMany(find);
  }

  async getTotal(find?: Record<string, any>): Promise<number> {
    return this.apiKeyRepository.getTotal(find);
  }

  /**
   * reset hash api-key.
   *
   * @param {ApiKeyDoc}repository api-key repository
   * @param {string}secret secret string
   */
  async reset(repository: ApiKeyDoc, secret: string): Promise<ApiKeyDoc> {
    const hash: string = await this.createHashApiKey(repository.key, secret);
    repository.hash = hash;

    return this.apiKeyRepository.save(repository);
  }

  /**
   * Make isActive to true
   *
   * @param {ApiKeyDoc} repository api-key repository
   * @returns {Promise<ApiKeyDoc>} Promise<ApiKeyDoc>
   */
  async active(repository: ApiKeyDoc): Promise<ApiKeyDoc> {
    repository.isActive = true;

    return this.apiKeyRepository.save(repository);
  }

  /**
   * Make isActive to false
   *
   * @param {ApiKeyDoc} repository api-key repository
   * @returns {Promise<ApiKeyDoc>} Promise<ApiKeyDoc>
   */
  async inActive(repository: ApiKeyDoc): Promise<ApiKeyDoc> {
    repository.isActive = false;

    return this.apiKeyRepository.save(repository);
  }

  /**
   * softDelete make repository.deletedAt = new Date().
   *
   * @param {ApiKeyDoc} repository ApiKeyDoc
   * @returns {Promise<ApiKeyDoc>} Promise ApiKeyDoc
   */
  async delete(repository: ApiKeyDoc): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.softDelete(repository);
  }

  /**
   * Update Apikey startDate and endDate
   *
   * @param repository apiKeyDoc
   * @param dto ApiKeyUpdateDateDto
   * @param dto.startDate start date apiKey
   * @param dto.endDate start date apiKey
   * @example
   *    await apiKeyService.updateDate(apiKey,{startDate: new Date(), endDate: new Date()})
   * @returns Promise ApiKeyDoc
   */
  async updateDate(
    repository: ApiKeyDoc,
    { startDate, endDate }: ApiKeyUpdateDateDto,
  ): Promise<ApiKeyDoc> {
    repository.startDate = this.helperDateService.startOfDay(startDate);
    repository.endDate = this.helperDateService.endOfDay(endDate);

    return this.apiKeyRepository.save(repository);
  }
}
