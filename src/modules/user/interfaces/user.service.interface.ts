import { IAuthPassword } from "src/common/auth/interfaces/auth.interface";
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserDoc } from "../repository/entities/user.entity";
import { UserPayloadSerialization } from "../serializations/user.payload.serialization";
import { IUserDoc, IUserEntity } from "./user.interface";

export interface IUserService {
  create(
    { firstName, lastName, email, mobileNumber, role, userName }: UserCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
  ): Promise<UserDoc>;
  findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<IUserEntity[]>;
  findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  findOneByEmail<T>(email: string, options?: IDatabaseFindOneOptions): Promise<T>;
  deleteMany(find: Record<string, any>): Promise<boolean>;
  resetPasswordAttempt(repository: UserDoc): Promise<UserDoc>;
  increasePasswordAttempt(repository: UserDoc): Promise<UserDoc>;
  joinWithRole(repository: UserDoc): Promise<IUserDoc>;
  payloadSerialization(data: IUserDoc): Promise<UserPayloadSerialization>;
  blocked(repository: UserDoc): Promise<UserDoc>;
  inactive(repository: UserDoc): Promise<UserDoc>;
  active(repository: UserDoc): Promise<UserDoc>;
  inactivePermanent(repository: UserDoc): Promise<UserDoc>;
}
