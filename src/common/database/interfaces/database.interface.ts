import { PopulateOptions } from "mongoose";
import { IPaginationOptions } from "src/common/pagination/interfaces/pagination.interface";

export interface IDatabaseFindOneOptions<T = any> extends Pick<IPaginationOptions, "order"> {
  select?: Record<string, boolean | number>;
  join?: boolean | PopulateOptions | PopulateOptions[];
  session?: T;
  withDeleted?: boolean;
}

export interface IDatabaseCreateOptions<T = any>
  extends Pick<IDatabaseFindOneOptions<T>, "session"> {
  _id?: string;
}

export interface IDatabaseFindAllOptions<T = any>
  extends IPaginationOptions,
    Omit<IDatabaseFindOneOptions<T>, "order"> {}

export interface IDatabaseExistOptions<T = any>
  extends Pick<IDatabaseFindOneOptions<T>, "session" | "withDeleted" | "join"> {
  excludeId?: string[];
}
