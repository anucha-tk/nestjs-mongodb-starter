import { Injectable } from "@nestjs/common";
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { RoleCreateDto } from "../dtos/role.create.dto";
import { IRoleService } from "../interfaces/role.service.interface";
import { RoleDoc, RoleEntity } from "../repository/entities/role.entity";
import { RoleRepository } from "../repository/repositories/role.repository";

@Injectable()
export class RoleService implements IRoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleEntity[]> {
    return this.roleRepository.findAll<RoleEntity>(find, options);
  }

  async findOneByName(name: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc> {
    return this.roleRepository.findOne<RoleDoc>({ name }, options);
  }

  async create({ name, description, type, permissions }: RoleCreateDto): Promise<RoleDoc> {
    const create: RoleEntity = new RoleEntity();
    create.name = name;
    create.description = description;
    create.type = type;
    create.permissions = permissions;
    create.isActive = true;

    return this.roleRepository.create<RoleEntity>(create);
  }

  async createMany(data: RoleCreateDto[]): Promise<boolean> {
    const create: RoleEntity[] = data.map(({ type, name, permissions }) => {
      const entity: RoleEntity = new RoleEntity();
      entity.type = type;
      entity.isActive = true;
      entity.name = name;
      entity.permissions = permissions;

      return entity;
    });
    return this.roleRepository.createMany<RoleEntity>(create);
  }

  async deleteMany(find: Record<string, any>): Promise<boolean> {
    return this.roleRepository.deleteMany(find);
  }

  async getTotal(find?: Record<string, any>): Promise<number> {
    return this.roleRepository.getTotal(find);
  }
}
