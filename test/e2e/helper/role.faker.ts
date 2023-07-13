import { faker } from "@faker-js/faker";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { RoleCreateDto, RolePermissionsDto } from "src/modules/role/dtos/role.create.dto";
import { RoleDoc } from "src/modules/role/repository/entities/role.entity";
import { RoleService } from "src/modules/role/services/role.service";

/**
 * RoleFaker for testing.
 */
export class RoleFaker {
  constructor(private readonly roleService: RoleService) {}

  /**
   * createRoleSuperAdmin.
   *
   * @param Object Optional
   * @param Object.name Optional name string
   * @returns Promise RoleDoc
   */
  public async createRoleSuperAdmin({ name }: { name?: string }): Promise<RoleDoc> {
    const role: RoleCreateDto = {
      name: name ?? `super_admin_${faker.string.alphanumeric(5)}`,
      type: ENUM_ROLE_TYPE.SUPER_ADMIN,
      permissions: [],
    };

    return this.roleService.create(role);
  }

  /**
   * createRoleAdmin.
   *
   * @param Object Optional
   * @param Object.name Optional name string
   * @param Object.permissions Optional RolePermissionsDto[]
   * @example
   *    roleFaker.createRoleAdmin({name: "abc", permissions: [ { subject: ENUM_POLICY_SUBJECT.ROLE, action: [] } ]})
   * @returns Promise RoleDoc
   */
  public async createRoleAdmin({
    name,
    permissions,
  }: {
    name?: string;
    permissions?: RolePermissionsDto[];
  }): Promise<RoleDoc> {
    const allPermissions = Object.values(ENUM_POLICY_SUBJECT).map((val) => ({
      subject: val,
      action: [ENUM_POLICY_ACTION.MANAGE],
    }));

    const role: RoleCreateDto = {
      name: name ?? `admin_${faker.string.alphanumeric(5)}`,
      type: ENUM_ROLE_TYPE.ADMIN,
      permissions: permissions ?? allPermissions,
    };

    return this.roleService.create(role);
  }

  /**
   * createRoleUser.
   *
   * @param Object Optional
   * @param Object.name Optional name string
   * @param Object.permissions Optional RolePermissionsDto[]
   * @param Object.isActive Optional role isActive boolean `default = true`
   * @returns Promise RoleDoc
   */
  public async createRoleUser({
    name,
    permissions,
    isActive = true,
  }: {
    name?: string;
    permissions?: RolePermissionsDto[];
    isActive?: boolean;
  }): Promise<RoleDoc> {
    const roleDto: RoleCreateDto = {
      name: name ?? `user_${faker.string.alphanumeric(5)}`,
      type: ENUM_ROLE_TYPE.USER,
      permissions: permissions ?? [],
    };

    const role = await this.roleService.create(roleDto);
    if (!isActive) {
      return this.roleService.update(role, { isActive: false });
    }
    return role;
  }
}
