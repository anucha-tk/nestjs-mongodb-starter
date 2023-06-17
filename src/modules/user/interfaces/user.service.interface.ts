import { IDatabaseFindAllOptions } from "src/common/database/interfaces/database.interface";
import { IUserEntity } from "./user.interface";

export interface IUserService {
  findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<IUserEntity[]>;
}
