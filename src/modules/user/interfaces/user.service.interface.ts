import { IAuthPassword } from "src/common/auth/interfaces/auth.interface";
import {
  IDatabaseExistDeletedOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { UserImportDto } from "../dtos/user.import.dto";
import { UserUpdateGoogleSSODto } from "../dtos/user.update-google-sso.dto";
import { UserUpdateNameDto } from "../dtos/user.update-name.dto";
import { UserDoc } from "../repository/entities/user.entity";
import { UserPayloadSerialization } from "../serializations/user.payload.serialization";
import { IUserCreate, IUserDoc, IUserEntity } from "./user.interface";

export interface IUserService {
  create(
    { firstName, lastName, email, mobileNumber, role, userName }: IUserCreate,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
  ): Promise<UserDoc>;
  findOne<T = UserDoc>(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<T>;
  findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<IUserEntity[]>;
  findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  findOneByEmail<T>(email: string, options?: IDatabaseFindOneOptions): Promise<T>;
  softDelete(repository: UserDoc): Promise<UserDoc>;
  deleteOne(repository: UserDoc): Promise<UserDoc>;
  restore(repository: UserDoc): Promise<UserDoc>;
  deleteMany(find: Record<string, any>): Promise<boolean>;
  resetPasswordAttempt(repository: UserDoc): Promise<UserDoc>;
  increasePasswordAttempt(repository: UserDoc): Promise<UserDoc>;
  joinWithRole(repository: UserDoc): Promise<IUserDoc>;
  payloadSerialization(data: IUserDoc): Promise<UserPayloadSerialization>;
  blocked(repository: UserDoc): Promise<UserDoc>;
  inactive(repository: UserDoc): Promise<UserDoc>;
  active(repository: UserDoc): Promise<UserDoc>;
  inactivePermanent(repository: UserDoc): Promise<UserDoc>;
  existByEmail(email: string, options?: IDatabaseExistDeletedOptions): Promise<boolean>;
  existByMobileNumber(
    mobileNumber: string,
    options?: IDatabaseExistDeletedOptions,
  ): Promise<boolean>;
  updateGoogleSSO(
    repository: UserDoc,
    { accessToken, refreshToken }: UserUpdateGoogleSSODto,
  ): Promise<UserDoc>;
  updatePassword(
    repository: UserDoc,
    { passwordHash, passwordExpired, passwordCreated, salt }: IAuthPassword,
  ): Promise<UserDoc>;
  updateName(repository: UserDoc, { firstName, lastName }: UserUpdateNameDto): Promise<UserDoc>;
  getTotal(find?: Record<string, any>): Promise<number>;
  import(
    data: UserImportDto[],
    role: string,
    { passwordCreated, passwordHash, salt }: IAuthPassword,
  ): Promise<boolean>;
}
