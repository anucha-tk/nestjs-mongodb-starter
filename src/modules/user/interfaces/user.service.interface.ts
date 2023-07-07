import { IAuthPassword } from "src/common/auth/interfaces/auth.interface";
import {
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserUpdateGoogleSSODto } from "../dtos/user.update-google-sso.dto";
import { UserDoc } from "../repository/entities/user.entity";
import { UserPayloadSerialization } from "../serializations/user.payload.serialization";
import { IUserDoc, IUserEntity } from "./user.interface";

export interface IUserService {
  create(
    { firstName, lastName, email, mobileNumber, role, userName }: UserCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
  ): Promise<UserDoc>;
  findOne<T = UserDoc>(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<T>;
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
  existByEmail(email: string, options?: IDatabaseExistOptions): Promise<boolean>;
  existByMobileNumber(mobileNumber: string, options?: IDatabaseExistOptions): Promise<boolean>;
  updateGoogleSSO(
    repository: UserDoc,
    { accessToken, refreshToken }: UserUpdateGoogleSSODto,
  ): Promise<UserDoc>;
}
