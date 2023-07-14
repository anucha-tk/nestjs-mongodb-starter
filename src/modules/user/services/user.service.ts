import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { IAuthPassword } from "src/common/auth/interfaces/auth.interface";
import {
  IDatabaseExistDeletedOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import { RoleEntity } from "src/modules/role/repository/entities/role.entity";
import { UserUpdateGoogleSSODto } from "../dtos/user.update-google-sso.dto";
import { UserUpdateNameDto } from "../dtos/user.update-name.dto";
import { IUserCreate, IUserDoc, IUserEntity } from "../interfaces/user.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { UserDoc, UserEntity } from "../repository/entities/user.entity";
import { UserRepository } from "../repository/repositories/user.repository";
import { UserPayloadSerialization } from "../serializations/user.payload.serialization";

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helperDateService: HelperDateService,
  ) {}

  async create(
    { firstName, lastName, email, mobileNumber, role, signUpFrom, userName }: IUserCreate,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.firstName = firstName;
    create.username = userName;
    create.email = email;
    create.password = passwordHash;
    create.role = role;
    create.isActive = true;
    create.inactivePermanent = false;
    create.blocked = false;
    create.lastName = lastName;
    create.salt = salt;
    create.passwordExpired = passwordExpired;
    create.passwordCreated = passwordCreated;
    create.signUpDate = this.helperDateService.create();
    create.passwordAttempt = 0;
    create.mobileNumber = mobileNumber ?? undefined;
    create.signUpFrom = signUpFrom;

    return this.userRepository.create<UserEntity>(create);
  }

  /**
   * Find one user
   * @param find Object to find Record<string, any>
   * @param options Optional IDatabaseFindOneOptions
   * @param options.select Optional boolean
   * @param options.join Optional boolean
   * @param options.withDelete Optional boolean
   * @param options.order Optional Record<string,ENUM_PAGINATION_ORDER_DIRECTION_TYPE>
   *
   * @returns Promise UserDoc
   * */
  async findOne<T = UserDoc>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>(find, options);
  }

  async findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T> {
    return this.userRepository.findOneById<T>(_id, options);
  }

  /**
   * Find all user with join true (default)
   *
   * @param find Object to find Record<string, any>
   * @param options Optional IDatabaseFindOneOptions
   * @param options.select Optional boolean
   * @param options.join Optional boolean
   * @param options.withDelete Optional boolean
   * @param options.order Optional Record<string,ENUM_PAGINATION_ORDER_DIRECTION_TYPE>
   * @param options.paging Optional IPaginationOptions
   *
   * @returns Promise IUserEntity[]
   * */
  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserEntity[]> {
    return this.userRepository.findAll<IUserEntity>(find, {
      ...options,
      join: options?.join ?? true,
    });
  }

  async findOneByEmail<T>(email: string, options?: IDatabaseFindOneOptions): Promise<T> {
    return this.userRepository.findOne<T>({ email }, options);
  }

  async softDelete(repository: UserDoc): Promise<UserDoc> {
    return this.userRepository.softDelete(repository);
  }

  async deleteOne(repository: UserDoc): Promise<UserDoc> {
    return this.userRepository.deleteOne(repository);
  }

  async deleteMany(find: Record<string, any>): Promise<boolean> {
    return this.userRepository.deleteMany(find);
  }

  async restore(repository: UserDoc): Promise<UserDoc> {
    return this.userRepository.restore(repository);
  }

  async increasePasswordAttempt(repository: UserDoc): Promise<UserDoc> {
    repository.passwordAttempt = ++repository.passwordAttempt;

    return this.userRepository.save(repository);
  }

  async joinWithRole(repository: UserDoc): Promise<IUserDoc> {
    return repository.populate({
      path: "role",
      localField: "role",
      foreignField: "_id",
      model: RoleEntity.name,
    });
  }

  /**
   * Reset password attempt user repository
   *
   * @param repository user repository
   * @returns Promise UserDoc
   */
  async resetPasswordAttempt(repository: UserDoc): Promise<UserDoc> {
    repository.passwordAttempt = 0;

    return this.userRepository.save(repository);
  }

  async payloadSerialization(data: IUserDoc): Promise<UserPayloadSerialization> {
    return plainToInstance(UserPayloadSerialization, data.toObject());
  }

  async blocked(repository: UserDoc): Promise<UserDoc> {
    repository.blocked = true;
    repository.blockedDate = this.helperDateService.create();

    return this.userRepository.save(repository);
  }

  async active(repository: UserDoc): Promise<UserDoc> {
    repository.isActive = true;
    repository.inactiveDate = undefined;

    return this.userRepository.save(repository);
  }

  async inactive(repository: UserDoc): Promise<UserDoc> {
    repository.isActive = false;
    repository.inactiveDate = this.helperDateService.create();

    return this.userRepository.save(repository);
  }

  async inactivePermanent(repository: UserDoc): Promise<UserDoc> {
    repository.isActive = false;
    repository.inactivePermanent = true;
    repository.inactiveDate = this.helperDateService.create();

    return this.userRepository.save(repository);
  }

  /**
   * Check email user exist withDeleted
   *
   * @param email user email
   * @param options IDatabaseExistDeletedOptions
   * @param options.join Optional join boolean
   * @param options.excludeId Optional excludeId boolean
   *
   * @returns Promise boolean
   */
  async existByEmail(email: string, options?: IDatabaseExistDeletedOptions): Promise<boolean> {
    return this.userRepository.exists(
      {
        email: {
          $regex: new RegExp(`\\b${email}\\b`),
          $options: "i",
        },
      },
      { ...options, withDeleted: true },
    );
  }

  /**
   * Check mobileNumber user exist withDeleted
   *
   * @param mobileNumber string of user mobileNumber
   * @param options IDatabaseExistDeletedOptions
   * @param options.join Optional join boolean
   * @param options.excludeId Optional excludeId boolean
   *
   * @returns Promise boolean
   */
  async existByMobileNumber(
    mobileNumber: string,
    options?: IDatabaseExistDeletedOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      {
        mobileNumber,
      },
      { ...options, withDeleted: true },
    );
  }

  async updateGoogleSSO(
    repository: UserDoc,
    { accessToken, refreshToken }: UserUpdateGoogleSSODto,
  ): Promise<UserDoc> {
    repository.google = {
      accessToken,
      refreshToken,
    };

    return this.userRepository.save(repository);
  }

  /**
   * Update user new password
   *
   * @param repository User repository
   * @param authPassword IAuthPassword
   * @param authPassword.passwordHash password hash string
   * @param authPassword.passwordExpired password expired Date
   * @param authPassword.passwordCreated password created Date
   * @param authPassword.salt salt password
   *
   * @returns Promise UserDoc
   * */
  async updatePassword(
    repository: UserDoc,
    { passwordHash, passwordExpired, passwordCreated, salt }: IAuthPassword,
  ): Promise<UserDoc> {
    repository.password = passwordHash;
    repository.passwordExpired = passwordExpired;
    repository.passwordCreated = passwordCreated;
    repository.salt = salt;

    return this.userRepository.save(repository);
  }

  /**
   * Update firstName and lastName user
   *
   * @param repository User repository
   * @param name UserUpdateNameDto
   * @param name.firstName firstName string user
   * @param name.lastName lastName string user
   *
   * @returns Promise UserDoc
   * */
  async updateName(
    repository: UserDoc,
    { firstName, lastName }: UserUpdateNameDto,
  ): Promise<UserDoc> {
    repository.firstName = firstName;
    repository.lastName = lastName;

    return this.userRepository.save(repository);
  }

  /**
   * Get total user number with find condition(Optional) from database
   *
   * @param find Optional find Record<string, any> condition
   * @returns Promise user number
   */
  async getTotal(find?: Record<string, any>): Promise<number> {
    return this.userRepository.getTotal(find);
  }

  /**
   * Check username user exist withDeleted
   *
   * @param username string of userName user
   * @param options IDatabaseExistDeletedOptions
   * @param options.join Optional join boolean
   * @param options.excludeId Optional excludeId boolean
   *
   * @returns Promise boolean
   */
  async existByUsername(
    username: string,
    options?: IDatabaseExistDeletedOptions,
  ): Promise<boolean> {
    return this.userRepository.exists({ username }, { ...options, withDeleted: true });
  }
}
