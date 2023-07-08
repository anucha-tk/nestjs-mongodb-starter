import {
  IDatabaseExistOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { RoleCreateDto } from "../dtos/role.create.dto";
import { RoleUpdatePermissionsDto } from "../dtos/role.update-permissions.dto";
import { RoleDoc } from "../repository/entities/role.entity";

export interface IRoleService {
  create(data: RoleCreateDto): Promise<RoleDoc>;
  createMany(data: RoleCreateDto[]): Promise<boolean>;
  findOneByName(name: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>;
  findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>;
  deleteMany(find: Record<string, any>): Promise<boolean>;
  getTotal(find?: Record<string, any>): Promise<number>;
  existByName(name: string, options?: IDatabaseExistOptions): Promise<boolean>;
  delete(repository: RoleDoc): Promise<RoleDoc>;
  inActive(repository: RoleDoc): Promise<RoleDoc>;
  active(repository: RoleDoc): Promise<RoleDoc>;
  updatePermissions(
    repository: RoleDoc,
    { type, permissions }: RoleUpdatePermissionsDto,
  ): Promise<RoleDoc>;
}
