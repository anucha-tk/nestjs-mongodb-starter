import { ClientSession, Model, PopulateOptions } from "mongoose";
import { IDatabaseFindOneOptions } from "src/common/database/interfaces/database.interface";
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

  async findOne<T = EntityDocument>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<ClientSession>,
  ): Promise<T> {
    const findOne = this._repository.findOne<EntityDocument>(find);

    if (options?.select) {
      findOne.select(options.select);
    }

    if (options?.join) {
      findOne.populate(
        typeof options.join === "boolean"
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    if (options?.order) {
      findOne.sort(options.order);
    }

    return findOne.exec() as any;
  }

  async deleteMany(find: Record<string, any>): Promise<boolean> {
    const del = this._repository.deleteMany(find);

    try {
      await del;
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }
}
