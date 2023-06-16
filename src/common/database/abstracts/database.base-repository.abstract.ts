import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from "../interfaces/database.interface";

export abstract class DatabaseBaseRepositoryAbstract<Entity> {
  abstract create<Dto = any>(data: Dto): Promise<Entity>;
  abstract createMany<Dto>(data: Dto[]): Promise<boolean>;
  abstract findOne<T = Entity>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<T>;
  abstract findAll<T = Entity>(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<T[]>;
  abstract deleteMany(find: Record<string, any>): Promise<boolean>;
  abstract getTotal(find?: Record<string, any>): Promise<number>;
}
