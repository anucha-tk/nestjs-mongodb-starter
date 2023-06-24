import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { AuthService } from "src/common/auth/services/auth.service";
import { ENUM_USER_SIGN_UP_FROM } from "src/modules/user/constants/user.enum.constant";
import { UserCreateDto } from "src/modules/user/dtos/user.create.dto";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";

export const mockPassword = "xxyyZZ@@123444";

export const createUser = async ({
  app,
  roleId,
  password = mockPassword,
}: {
  app: INestApplication;
  roleId: string;
  password?: string;
}): Promise<UserDoc> => {
  const authService = app.get(AuthService);
  const userService = app.get(UserService);

  const [passwordHash] = await Promise.all([authService.createPassword(password)]);
  const userCreateDto: UserCreateDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password,
    signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
    role: roleId,
    mobileNumber: faker.phone.number("##########"),
  };

  return userService.create(userCreateDto, passwordHash);
};

export const createAdmin = async ({
  app,
  roleId,
  password = mockPassword,
}: {
  app: INestApplication;
  roleId: string;
  password?: string;
}): Promise<UserDoc> => {
  const authService = app.get(AuthService);
  const userService = app.get(UserService);

  const [passwordHash] = await Promise.all([authService.createPassword(password)]);
  const userCreateDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password,
    signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
    role: roleId,
  };
  return userService.create(userCreateDto, passwordHash);
};
