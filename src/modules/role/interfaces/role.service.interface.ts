import { RoleCreateDto } from "../dtos/role.create.dto";
import { RoleDoc } from "../repository/entities/role.entity";

export interface IRoleService {
  create(data: RoleCreateDto): Promise<RoleDoc>;
  createMany(data: RoleCreateDto[]): Promise<boolean>;
  deleteMany(find: Record<string, any>): Promise<boolean>;
}
