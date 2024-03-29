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
    mobileNumber: faker.phone.number("##########"),
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
            findOne: jest.fn().mockImplementation(({ _id }, join) => {
              let find = new userKeyEntityDoc();
              find._id = userKeyId;

              if (_id) {
                find._id = _id;
              }

              if (join) {
                find = find.toObject();
                return { ...find, role: roleDoc };
              }

              return find;
            }),
            softDelete: jest.fn().mockImplementation(() => {
              const find = new userKeyEntityDoc();
              find._id = userKeyId;
              find.deletedAt = new Date();

              return find;
            }),
            deleteOne: jest.fn().mockImplementation(() => {
              const find = new userKeyEntityDoc();
              find._id = userKeyId;

              return find;
            }),
            deleteMany: jest.fn().mockResolvedValue(true),
            restore: jest.fn().mockImplementation(() => {
              const find = new userKeyEntityDoc();
              find._id = userKeyId;
              find.deletedAt = undefined;

              return find;
            }),
            exists: jest.fn().mockResolvedValue(true),
            save: jest
              .fn()
              .mockImplementation(
                ({
                  userName,
                  firstName,
                  lastName,
                  blocked,
                  passwordAttempt,
                  isActive,
                  inactiveDate,
                  inactivePermanent,
                  salt,
                  password,
                  passwordCreated,
                  passwordExpired,
                }) => {
                  const find = new userKeyEntityDoc();
                  find._id = userKeyId;
                  find.username = userName;
                  find.firstName = firstName;
                  find.lastName = lastName;
                  find.blocked = blocked;
                  find.passwordAttempt = passwordAttempt;
                  find.isActive = isActive;
                  find.inactiveDate = inactiveDate;
                  find.inactivePermanent = inactivePermanent;
                  find.password = password;
                  find.salt = salt;
                  (find.passwordCreated = passwordCreated),
                    (find.passwordExpired = passwordExpired);

                  return find;
                },
              ),
            getTotal: jest.fn().mockImplementation((find) => {
              if (find) return 1;

              return 2;
            }),
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

  describe("existByEmail", () => {
    it("should return true when user exist", async () => {
      const email = userDoc.email;
      const result = await userService.existByEmail(email);
      expect(result).toBeTruthy();
    });
    it("should return false when user not exist", async () => {
      jest.spyOn(userRepository, "exists").mockResolvedValue(false);
      const email = faker.internet.email();
      const result = await userService.existByEmail(email);
      expect(result).toBeFalsy();
    });
  });

  describe("existByMobileNumber", () => {
    it("should return true when user mobileNumber exist", async () => {
      jest.spyOn(userRepository, "exists").mockResolvedValue(true);
      const phone = userDoc.mobileNumber;
      const result = await userService.existByMobileNumber(phone);
      expect(result).toBeTruthy();
    });
    it("should return false when user mobileNumber not exist", async () => {
      jest.spyOn(userRepository, "exists").mockResolvedValue(false);
      const phone = faker.phone.number();
      const result = await userService.existByMobileNumber(phone);
      expect(result).toBeFalsy();
    });
  });

  describe("findOne", () => {
    it("should return userDoc", async () => {
      const result = await userService.findOne({ _id: "123" });

      expect(result._id).toBe("123");
      expect(userRepository.findOne).toBeCalled();
      expect(userRepository.findOne).toBeCalledWith({ _id: "123" }, undefined);
    });
    it("should return userDocWithRole", async () => {
      const result = await userService.findOne({ _id: "123" }, { join: true });

      expect(result._id).toBe("123");
      expect(result.role).toBeDefined();
      expect(userRepository.findOne).toBeCalled();
      expect(userRepository.findOne).toBeCalledWith({ _id: "123" }, { join: true });
    });
  });

  describe("updatePassword", () => {
    it("should return IAuthPassword when updatePassword", async () => {
      const userDoc = new userKeyEntityDoc();
      const authPassword: IAuthPassword = {
        passwordHash: faker.string.alphanumeric(10),
        passwordCreated: faker.date.recent(),
        passwordExpired: faker.date.future(),
        salt: faker.string.alphanumeric(10),
      };
      const result = await userService.updatePassword(userDoc, authPassword);

      expect(result).toBeDefined();
      expect(result.salt).toBe(authPassword.salt);
      expect(result.password).toBe(authPassword.passwordHash);
      expect(result.passwordCreated).toBe(authPassword.passwordCreated);
      expect(result.passwordExpired).toBe(authPassword.passwordExpired);
      expect(userRepository.save).toBeCalled();
    });
  });

  describe("updateName", () => {
    it("should return firstName and lastName", async () => {
      const user = new userKeyEntityDoc();
      user.firstName = "abc";
      user.lastName = "xyz";
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const result = await userService.updateName(user, { firstName, lastName });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("firstName", firstName.toLowerCase());
      expect(result).toHaveProperty("lastName", lastName.toLowerCase());
    });
  });

  describe("getTotal", () => {
    it("should return two user", async () => {
      const result = await userService.getTotal();
      expect(typeof result).toBe("number");
      expect(result).toBe(2);
      expect(userRepository.getTotal).toBeCalledWith(undefined, undefined);
    });
    it("should return one user when find", async () => {
      const result = await userService.getTotal({ name: "abc" });
      expect(typeof result).toBe("number");
      expect(result).toBe(1);
      expect(userRepository.getTotal).toBeCalledWith({ name: "abc" }, undefined);
    });
    it("should call withDeleted", async () => {
      const result = await userService.getTotal({}, { withDeleted: true });
      expect(typeof result).toBe("number");
      expect(userRepository.getTotal).toBeCalledWith({}, { withDeleted: true });
    });
  });

  describe("existByUsername", () => {
    it("should return userDoc", async () => {
      const result = await userService.existByUsername("abc");

      expect(typeof result).toBe("boolean");
      expect(userRepository.exists).toBeCalledWith({ username: "abc" }, { withDeleted: true });
    });
  });

  describe("softDelete", () => {
    it("should soft delete userDoc", async () => {
      const user = new userKeyEntityDoc();
      const result = await userService.softDelete(user);

      expect(result).toHaveProperty("deletedAt");
      expect(userRepository.softDelete).toBeCalled();
      expect(userRepository.softDelete).toBeCalledWith(user);
    });
  });

  describe("deleteOne", () => {
    it("should deleteOne userDoc", async () => {
      const user = new userKeyEntityDoc();
      const result = await userService.deleteOne(user);

      expect(result).toBeDefined();
      expect(userRepository.deleteOne).toBeCalled();
      expect(userRepository.deleteOne).toBeCalledWith(user);
    });
  });

  describe("restore", () => {
    it("should restore userDoc", async () => {
      const user = new userKeyEntityDoc();
      const result = await userService.restore(user);

      expect(result.deletedAt).toBeUndefined();
      expect(userRepository.restore).toBeCalled();
      expect(userRepository.restore).toBeCalledWith(user);
    });
  });
});
