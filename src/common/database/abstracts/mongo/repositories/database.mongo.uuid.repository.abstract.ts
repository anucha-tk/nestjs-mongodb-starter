import { Model, PopulateOptions } from "mongoose";
import { DatabaseBaseRepositoryAbstract } from "../../database.base-repository.abstract";

export abstract class DatabaseMongoUUIDRepositoryAbstract<
  Entity,
  EntityDocument,
> extends DatabaseBaseRepositoryAbstract<EntityDocument> {
  protected _repository: Model<Entity>;
  protected _joinOnFind?: PopulateOptions | PopulateOptions[];

  constructor(repository: Model<Entity>, options?: PopulateOptions | PopulateOptions[]) {
    super();

    this._repository = repository;
    this._joinOnFind = options;
  }

  async create<Dto = any>(data: Dto): Promise<EntityDocument> {
    const dataCreate: Record<string, any> = data;
    const create = await this._repository.create([dataCreate]);
    return create[0] as EntityDocument;
  }
}
