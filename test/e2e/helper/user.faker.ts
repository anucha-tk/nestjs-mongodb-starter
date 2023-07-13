import { faker } from "@faker-js/faker";
import { AuthService } from "src/common/auth/services/auth.service";
import { RolePermissionsDto } from "src/modules/role/dtos/role.create.dto";
import { RoleService } from "src/modules/role/services/role.service";
import { ENUM_USER_SIGN_UP_FROM } from "src/modules/user/constants/user.enum.constant";
import { UserCreateDto } from "src/modules/user/dtos/user.create.dto";
import { UserDoc } from "src/modules/user/repository/entities/user.entity";
import { UserService } from "src/modules/user/services/user.service";
import { RoleFaker } from "./role.faker";

/**
 * UserFaker for testing.
 */
export class UserFaker {
  public static readonly password = "xyZZ@@123444";
  private readonly roleFaker: RoleFaker;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {
    this.roleFaker = new RoleFaker(roleService);
  }

  /**
   * getPassword.
   *
   * @param boolean Optional boolean for random password
   * @default password here UserFaker.password or "xyZZ@@123444"
   * @example
   *    getPassword() // xyZZ@@123444
   *    getPassword(true) // new random password
   * @returns Promise password string
   */
  public async getPassword(random?: boolean): Promise<string> {
    return random ? this.authService.createPasswordRandom() : UserFaker.password;
  }

  /**
   * CreateUser and create role `ENUM_ROLE_TYPE.USER`
   *
   * @param Object Optional
   * @param Object.password Optional user password string
   * @default password here UserFaker.password or "xyZZ@@123444"
   * @example
   *    createUser({ password: "abc" })
   * @returns Promise UserDoc
   */
  public async createUser({ password }: { password?: string }): Promise<UserDoc> {
    const passwordHash = await this.authService.createPassword(password ?? UserFaker.password);
    const role = await this.roleFaker.createRoleUser({});

    const userCreateDto: UserCreateDto = {
      firstName: `user_${faker.person.firstName()}`,
      lastName: `user_${faker.person.lastName()}`,
      email: `user_${faker.internet.email()}`,
      password: password ?? UserFaker.password,
      signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
      role: role._id,
      mobileNumber: faker.phone.number("##########"),
      userName: faker.person.middleName(),
    };

    return this.userService.create(userCreateDto, passwordHash);
  }

  /**
   * CreateAdmin user and create role `ENUM_ROLE_TYPE.ADMIN.`
   *
   * @param Object Optional
   * @param Object.password Optional password string
   * @param Object.permissions Optional permissions RolePermissionsDto[]
   * @default password here UserFaker.password or "xyZZ@@123444"
   * @example
   *    createAdmin({ password: "abc", permissions: [] })
   * @returns Promise UserDoc
   */
  public async createAdmin({
    password,
    permissions,
  }: {
    password?: string;
    permissions?: RolePermissionsDto[];
  }): Promise<UserDoc> {
    const passwordHash = await this.authService.createPassword(password ?? UserFaker.password);
    const role = await this.roleFaker.createRoleAdmin({ permissions });

    const userCreateDto: UserCreateDto = {
      firstName: `admin_${faker.person.firstName()}`,
      lastName: `admin_${faker.person.lastName()}`,
      email: `admin_${faker.internet.email()}`,
      password: password ?? UserFaker.password,
      signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
      role: role._id,
      mobileNumber: faker.phone.number("##########"),
    };

    return this.userService.create(userCreateDto, passwordHash);
  }
}
