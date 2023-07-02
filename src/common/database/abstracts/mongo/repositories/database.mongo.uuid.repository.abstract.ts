import { Model, PopulateOptions, Document } from "mongoose";
import { DATABASE_DELETED_AT_FIELD_NAME } from "src/common/database/constants/database.constant";
import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
} from "src/common/database/interfaces/database.interface";
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

  async create<Dto = any>(data: Dto, options?: IDatabaseCreateOptions): Promise<EntityDocument> {
    const dataCreate: Record<string, any> = data;
    if (options?._id) {
      dataCreate._id = options._id;
    }
    const create = await this._repository.create([dataCreate]);

    return create[0] as EntityDocument;
  }

  async createMany<Dto>(data: Dto[]): Promise<boolean> {
    const create = this._repository.insertMany(data);

    try {
      await create;
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }

  async findOne<T = EntityDocument>(
    find: Record<string, any>,
    options: IDatabaseFindOneOptions = { withDeleted: false },
  ): Promise<T> {
    const findOne = this._repository.findOne<EntityDocument>(find);
    if (options?.withDeleted) {
      findOne.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
        },
      ]);
    } else {
      findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
    }

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

  async findOneById<T = EntityDocument>(
    _id: string,
    options: IDatabaseFindOneOptions = { withDeleted: false },
  ): Promise<T> {
    const findOne = this._repository.findById<EntityDocument>(_id);

    if (options?.withDeleted) {
      findOne.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
        },
      ]);
    } else {
      findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
    }

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

  async findAll<T = EntityDocument>(
    find?: Record<string, any>,
    options: IDatabaseFindAllOptions = { withDeleted: false },
  ): Promise<T[]> {
    const findAll = this._repository.find<EntityDocument>(find);

    if (options?.withDeleted) {
      findAll.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
        },
      ]);
    } else {
      findAll.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.select) {
      findAll.select(options.select);
    }

    if (options?.paging) {
      findAll.limit(options.paging.limit).skip(options.paging.offset);
    }

    if (options?.order) {
      findAll.sort(options.order);
    }

    if (options?.join) {
      findAll.populate(
        typeof options.join === "boolean"
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    return findAll.lean() as any;
  }

  async deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions): Promise<boolean> {
    const del = this._repository.deleteMany(find);
    if (options?.join) {
      del.populate(
        typeof options.join === "boolean"
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    try {
      await del;
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }

  async getTotal(find?: Record<string, any>, options?: IDatabaseGetTotalOptions): Promise<number> {
    const count = this._repository.countDocuments(find);
    if (options?.withDeleted) {
      count.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
        },
      ]);
    } else {
      count.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.join) {
      count.populate(
        typeof options.join === "boolean"
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }
    return count;
  }

  async save(repository: EntityDocument & Document<string>): Promise<EntityDocument> {
    return repository.save();
  }

  async exists(find: Record<string, any>, options?: IDatabaseExistOptions): Promise<boolean> {
    if (options?.excludeId) {
      find = {
        ...find,
        _id: {
          $nin: options?.excludeId ?? [],
        },
      };
    }

    const exist = this._repository.exists(find);
    if (options?.withDeleted) {
      exist.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
        },
      ]);
    } else {
      exist.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
    }

    if (options?.join) {
      exist.populate(
        typeof options.join === "boolean"
          ? this._joinOnFind
          : (options.join as PopulateOptions | PopulateOptions[]),
      );
    }

    const result = await exist;
    return result ? true : false;
  }

  async softDelete(
    repository: EntityDocument & Document<string> & { deletedAt?: Date },
  ): Promise<EntityDocument> {
    repository.deletedAt = new Date();
    return repository.save();
  }
}
