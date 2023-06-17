import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";
import { UserDatabaseName, UserSchema } from "src/modules/user/repository/entities/user.entity";
import { UserRepository } from "src/modules/user/repository/repositories/user.repository";
import { UserService } from "src/modules/user/services/user.service";

describe("user service", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  const userKeyId = faker.string.uuid();
  const userKeyEntityDoc = new mongoose.Mongoose().model(UserDatabaseName, UserSchema);

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
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
});
