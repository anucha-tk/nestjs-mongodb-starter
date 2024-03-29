import { INestApplication } from "@nestjs/common";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { RoleCreateDto } from "src/modules/role/dtos/role.create.dto";
import { RoleRepository } from "src/modules/role/repository/repositories/role.repository";
import { RoleService } from "src/modules/role/services/role.service";

/**
 * @deprecated
 * */
interface CreateUserIPolicyRule {
  subject: ENUM_POLICY_SUBJECT;
  action: ENUM_POLICY_ACTION[];
}

/**
 * @deprecated
 * */
export const createRoleUser = (
  app: INestApplication,
  name: string,
  permissions?: CreateUserIPolicyRule[],
) => {
  const roles: RoleCreateDto = {
    name,
    type: ENUM_ROLE_TYPE.USER,
    permissions,
  };

  const roleService = app.get(RoleService);
  return roleService.create(roles);
};

/**
 * @deprecated
 * */
export const createInActiveRoleUser = async (
  app: INestApplication,
  name: string,
  permissions?: CreateUserIPolicyRule[],
) => {
  const roles: RoleCreateDto = {
    name,
    type: ENUM_ROLE_TYPE.USER,
    permissions,
  };

  const roleService = app.get(RoleService);
  const roleRepository = app.get(RoleRepository);
  const role = await roleService.create(roles);
  role.isActive = false;
  return roleRepository.save(role);
};

/**
 * @deprecated
 * */
export const createRoleAdmin = (
  app: INestApplication,
  name: string,
  permissions?: CreateUserIPolicyRule[],
) => {
  const role: RoleCreateDto = {
    name,
    type: ENUM_ROLE_TYPE.ADMIN,
    permissions: permissions
      ? permissions
      : Object.values(ENUM_POLICY_SUBJECT).map((val) => ({
          subject: val,
          action: [ENUM_POLICY_ACTION.MANAGE],
        })),
  };

  const roleService = app.get(RoleService);
  return roleService.create(role);
};

/**
 * @deprecated
 * */
export const createRoleSuperAdmin = (app: INestApplication, name: string) => {
  const role: RoleCreateDto = {
    name,
    type: ENUM_ROLE_TYPE.SUPER_ADMIN,
    permissions: [],
  };

  const roleService = app.get(RoleService);
  return roleService.create(role);
};
