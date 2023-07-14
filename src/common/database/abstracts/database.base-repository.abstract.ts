import {
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "../interfaces/database.interface";

export abstract class DatabaseBaseRepositoryAbstract<Entity> {
  abstract create<Dto = any>(data: Dto): Promise<Entity>;
  abstract createMany<Dto>(data: Dto[]): Promise<boolean>;
  abstract findOne<T = Entity>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  abstract findOneById<T = Entity>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  abstract findAll<T = Entity>(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<T[]>;
  abstract getTotal(find?: Record<string, any>): Promise<number>;
  abstract exists(find: Record<string, any>, options?: IDatabaseExistOptions): Promise<boolean>;
  abstract save(repository: Entity): Promise<Entity>;
  abstract softDelete(repository: Entity): Promise<Entity>;
  abstract deleteMany(find: Record<string, any>): Promise<boolean>;
  abstract deleteOne(repository: Entity): Promise<Entity>;
  abstract restore(repository: Entity): Promise<Entity>;
}
