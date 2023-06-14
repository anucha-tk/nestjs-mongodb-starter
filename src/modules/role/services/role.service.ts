import { Injectable } from "@nestjs/common";
import { RoleCreateDto } from "../dtos/role.create.dto";
import { IRoleService } from "../interfaces/role.service.interface";
import { RoleDoc, RoleEntity } from "../repository/entities/role.entity";
import { RoleRepository } from "../repository/repositories/role.repository";

@Injectable()
export class RoleService implements IRoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

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
}
