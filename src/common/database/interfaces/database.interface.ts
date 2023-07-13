import { PopulateOptions } from "mongoose";
import { IPaginationOptions } from "src/common/pagination/interfaces/pagination.interface";

export interface IDatabaseFindOneOptions extends Pick<IPaginationOptions, "order"> {
  select?: Record<string, boolean | number>;
  join?: boolean | PopulateOptions | PopulateOptions[];
  withDeleted?: boolean;
}

export interface IDatabaseCreateOptions {
  _id?: string;
}

export interface IDatabaseFindAllOptions
  extends IPaginationOptions,
    Omit<IDatabaseFindOneOptions, "order"> {}

export interface IDatabaseExistOptions
  extends Pick<IDatabaseFindOneOptions, "withDeleted" | "join"> {
  excludeId?: string[];
}
export type IDatabaseExistDeletedOptions = Omit<IDatabaseExistOptions, "withDeleted">;

export type IDatabaseManyOptions = Pick<IDatabaseFindOneOptions, "join">;

export type IDatabaseGetTotalOptions = Pick<IDatabaseFindOneOptions, "withDeleted" | "join">;
