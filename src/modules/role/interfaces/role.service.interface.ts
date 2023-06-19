import { IDatabaseFindOneOptions } from "src/common/database/interfaces/database.interface";
import { RoleCreateDto } from "../dtos/role.create.dto";
import { RoleDoc } from "../repository/entities/role.entity";

export interface IRoleService {
  create(data: RoleCreateDto): Promise<RoleDoc>;
  createMany(data: RoleCreateDto[]): Promise<boolean>;
  findOneByName(name: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>;
  deleteMany(find: Record<string, any>): Promise<boolean>;
  getTotal(find?: Record<string, any>): Promise<number>;
}
