import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";
import { IAuthPassword } from "src/common/auth/interfaces/auth.interface";
import { HelperDateService } from "src/common/helper/services/helper.date.service";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import {
  RoleDatabaseName,
  RoleDoc,
  RoleSchema,
} from "src/modules/role/repository/entities/role.entity";
import { ENUM_USER_SIGN_UP_FROM } from "src/modules/user/constants/user.enum.constant";
import { UserCreateDto } from "src/modules/user/dtos/user.create.dto";
import { IUserDoc } from "src/modules/user/interfaces/user.interface";
import {
  UserDatabaseName,
  UserDoc,
  UserEntity,
  UserSchema,
} from "src/modules/user/repository/entities/user.entity";
import { UserRepository } from "src/modules/user/repository/repositories/user.repository";
import { UserService } from "src/modules/user/services/user.service";

describe("user service", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  const userKeyId = faker.string.uuid();
  const userKeyEntityDoc = new mongoose.Mongoose().model(UserDatabaseName, UserSchema);
  const roleKeyEntityDoc = new mongoose.Mongoose().model(RoleDatabaseName, RoleSchema);
  let userDoc = new userKeyEntityDoc();
  userDoc = {
    _id: userKeyId,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    username: faker.person.middleName(),
    email: faker.internet.email(),
    password: faker.string.alphanumeric(8),
    passwordExpired: faker.date.future(),
    passwordCreated: faker.date.recent(),
    passwordAttempt: 0,
    mobileNumber: faker.phone.number(),
    role: ENUM_ROLE_TYPE.USER,
    signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
    signUpDate: faker.date.recent(),
    salt: faker.string.alphanumeric(10),
    isActive: false,
    inactiveDate: faker.date.future(),
    inactivePermanent: false,
    blocked: false,
    blockedDate: faker.date.future(),
    google: {
      accessToken: faker.string.alphanumeric(10),
      refreshToken: faker.string.alphanumeric(10),
    },
  } as UserDoc;

  let roleDoc = new roleKeyEntityDoc();
  roleDoc = {
    _id: faker.string.uuid(),
    name: faker.word.words(),
    type: ENUM_ROLE_TYPE.USER,
    isActive: true,
    permissions: [{ subject: ENUM_POLICY_SUBJECT.USER, action: [ENUM_POLICY_ACTION.READ] }],
  } as RoleDoc;

  const userDocWithRole: IUserDoc = {
    ...userDoc,
    role: roleDoc,
  } as IUserDoc;

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        HelperDateService,
        {
          provide: UserRepository,
          useValue: {
            create: jest
              .fn()
              .mockImplementation(
                ({
                  firstName,
                  email,
                  password,
                  role,
                  lastName,
                  salt,
                  passwordExpired,
                  passwordCreated,
                  mobileNumber,
                  signUpFrom,
                  username,
                }) => {
                  const create = new userKeyEntityDoc();
                  create._id = userKeyId;
                  create.firstName = firstName;
                  create.lastName = lastName;
                  create.username = username;
                  create.email = email;
                  create.password = password;
                  create.passwordExpired = passwordExpired;
                  create.passwordCreated = passwordCreated;
                  create.passwordAttempt = 0;
                  create.mobileNumber = mobileNumber ?? undefined;
                  create.role = role;
                  create.signUpFrom = signUpFrom;
                  create.signUpDate = faker.date.recent();
                  create.salt = salt;
                  create.isActive = false;
                  create.inactiveDate = faker.date.future();
                  create.inactivePermanent = false;
                  create.blocked = false;
                  create.blockedDate = faker.date.future();
                  create.google = {
                    accessToken: faker.string.alphanumeric(10),
                    refreshToken: faker.string.alphanumeric(10),
                  };

                  return create;
                },
              ),
            findAll: jest.fn().mockImplementation(() => {
              return [
                {
                  _id: faker.string.uuid(),
                  firstName: faker.person.firstName(),
                  lastName: faker.person.lastName(),
                },
                {
                  _id: faker.string.uuid(),
                  firstName: faker.person.firstName(),
                  lastName: faker.person.lastName(),
                },
                {
                  _id: faker.string.uuid(),
                  firstName: faker.person.firstName(),
                  lastName: faker.person.lastName(),
                },
              ];
            }),
            findOne: jest.fn().mockImplementation(() => {
              return { _id: userKeyId, ...userDocWithRole };
            }),
            deleteMany: jest.fn().mockResolvedValue(true),
            save: jest
              .fn()
              .mockImplementation(
                ({ blocked, passwordAttempt, isActive, inactiveDate, inactivePermanent }) => {
                  const find = new userKeyEntityDoc();
                  find._id = userKeyId;
                  find.blocked = blocked;
                  find.passwordAttempt = passwordAttempt;
                  find.isActive = isActive;
                  find.inactiveDate = inactiveDate;
                  find.inactivePermanent = inactivePermanent;

                  return find;
                },
              ),
          },
        },
      ],
    }).compile();

    userService = modRef.get<UserService>(UserService);
    userRepository = modRef.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("find", () => {
    describe("findAll", () => {
      it("should return user array", async () => {
        const users = await userService.findAll();

        expect(users).toBeDefined();
        expect(users).toHaveLength(3);
        expect(userRepository.findAll).toHaveBeenCalled();
      });
    });
    describe("findOneByEmail", () => {
      it("should return userDoc when findOneByEmail successful", async () => {
        const email = faker.internet.email();
        const result = await userService.findOneByEmail(email);

        expect(result).toBeDefined();
        expect(userRepository.findOne).toHaveBeenCalled();
        expect(userRepository.findOne).toBeCalledWith({ email }, undefined);
      });
    });
  });

  describe("create", () => {
    it("should return userDoc when create successful", async () => {
      jest.spyOn(userService, "create");

      const userDtos: UserCreateDto = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        mobileNumber: faker.phone.number(),
        role: ENUM_ROLE_TYPE.USER,
        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
        password: "123456",
        userName: faker.person.middleName(),
      };

      const passwordHash: IAuthPassword = {
        passwordExpired: faker.date.future(),
        passwordHash: faker.string.alphanumeric(10),
        salt: faker.string.alphanumeric(),
        passwordCreated: faker.date.recent(),
      };

      const user = await userService.create(userDtos, passwordHash);

      expect(user).toBeDefined();
      expect(user._id).toBeDefined();
      expect(user.firstName).toBeDefined();
      expect(user.lastName).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.passwordCreated).toBeDefined();
      expect(user.passwordExpired).toBeDefined();
      expect(user.passwordAttempt).toBeDefined();
      expect(user.mobileNumber).toBeDefined();
      expect(user.role).toBeDefined();
      expect(user.signUpFrom).toBeDefined();
      expect(user.signUpDate).toBeDefined();
      expect(user.salt).toBeDefined();
      expect(user.isActive).toBeDefined();
      expect(user.inactiveDate).toBeDefined();
      expect(user.inactivePermanent).toBeDefined();
      expect(user.blocked).toBeDefined();
      expect(user.blockedDate).toBeDefined();
      expect(user.google).toBeDefined();
      expect(user.username).toBeDefined();
      expect(user.password).toBeDefined();
      expect(userService.create).toBeCalledTimes(1);
      expect(userService.create).toBeCalledWith(userDtos, passwordHash);
    });
  });

  describe("deleteMany", () => {
    it("should return boolean and call with find", async () => {
      const find = { _id: userKeyId };
      const result = await userService.deleteMany(find);

      expect(result).toBeDefined();
      expect(typeof result).toBe("boolean");
      expect(userRepository.deleteMany).toBeCalledTimes(1);
      expect(userRepository.deleteMany).toBeCalledWith(find);
    });
  });

  describe("increasePasswordAttempt", () => {
    it("should save successful", async () => {
      const result = await userService.increasePasswordAttempt(new userKeyEntityDoc());

      expect(result).toBeDefined();
      expect(userRepository.save).toBeCalled();
      expect(result.passwordAttempt).toBe(1);
    });
  });

  describe("joinWithRole", () => {
    it.todo("should return user with populate role");
  });

  describe("resetPasswordAttempt", () => {
    it("should return passwordAttempt 0", async () => {
      jest.spyOn(userService, "resetPasswordAttempt");
      const userDoc: UserDoc = new UserEntity() as UserDoc;
      userDoc.passwordAttempt = 2;
      const result = await userService.resetPasswordAttempt(userDoc);

      expect(result).toBeDefined();
      expect(userService.resetPasswordAttempt).toBeCalled();
      expect(userService.resetPasswordAttempt).toBeCalledWith({
        passwordAttempt: userDoc.passwordAttempt,
      });
      expect(userRepository.save).toBeCalled();
    });
  });

  describe("payloadSerialization", () => {
    it.todo("should return user payloadSerialization");
  });

  describe("blocked", () => {
    it("should return userDoc true blocked", async () => {
      const result = await userService.blocked(new userKeyEntityDoc());

      expect(userRepository.save).toHaveBeenCalled();
      expect(result._id).toBe(userKeyId);
      expect(result.blocked).toBeTruthy();
    });
  });

  describe("inActive", () => {
    it("should return userDoc false inactive", async () => {
      const result = await userService.inactive(new userKeyEntityDoc());

      expect(userRepository.save).toHaveBeenCalled();
      expect(result._id).toBe(userKeyId);
      expect(result.isActive).toBeFalsy();
      expect(result.inactiveDate instanceof Date).toBeTruthy();
    });
  });

  describe("active", () => {
    it("should return userDoc true active", async () => {
      const result = await userService.active(new userKeyEntityDoc());

      expect(userRepository.save).toHaveBeenCalled();
      expect(result._id).toBe(userKeyId);
      expect(result.isActive).toBeTruthy();
      expect(result.inactiveDate).toBeUndefined();
    });
  });

  describe("inactivePermanent", () => {
    it("should return userDoc true inactivePermanent", async () => {
      const result = await userService.inactivePermanent(new userKeyEntityDoc());

      expect(userRepository.save).toHaveBeenCalled();
      expect(result._id).toBe(userKeyId);
      expect(result.inactivePermanent).toBeTruthy();
      expect(result.isActive).toBeFalsy();
      expect(result.inactiveDate instanceof Date).toBeTruthy();
    });
  });
});
