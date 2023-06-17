import { IAuthPassword } from "src/common/auth/interfaces/auth.interface";
import { IDatabaseFindAllOptions } from "src/common/database/interfaces/database.interface";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserDoc } from "../repository/entities/user.entity";
import { IUserEntity } from "./user.interface";

export interface IUserService {
  create(
    { firstName, lastName, email, mobileNumber, role, userName }: UserCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
  ): Promise<UserDoc>;
  findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<IUserEntity[]>;
  deleteMany(find: Record<string, any>): Promise<boolean>;
}
