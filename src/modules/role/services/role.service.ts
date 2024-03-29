import { Injectable } from "@nestjs/common";
import {
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from "src/common/database/interfaces/database.interface";
import { RoleCreateDto } from "../dtos/role.create.dto";
import { RoleUpdatePermissionsDto } from "../dtos/role.update-permissions.dto";
import { RoleUpdateDto } from "../dtos/role.update.dto";
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

  /**
   * Find one role
   *
   * @param find Record<string, any>
   * @param options IOptional DatabaseFindOneOptions
   * @param options.join Optional join relation another schema
   * @param options.withDeleted Optional boolean merge find document withDeleted
   * @param options.excludeId Optional exclude id string
   * @param options.order Optional Record<string, order>
   * @param options.select Optional Record<string, boolean | number>
   *
   * @returns Promise RoleDoc
   */
  async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<RoleDoc> {
    return this.roleRepository.findOne<RoleDoc>(find, options);
  }

  async findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc> {
    return this.roleRepository.findOne({ _id }, options);
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

  /**
   * Find role name.
   *
   * @param name name string
   * @param options IDatabaseExistOptions
   * @param options.join join relation another schema
   * @param options.withDeleted (default true) boolean merge find document withDeleted
   * @param options.excludeId exclude id string
   * @example await roleService.existByName('abc', { withDeleted: true })
   *
   * @returns Promise boolean
   */
  async existByName(name: string, options?: IDatabaseExistOptions): Promise<boolean> {
    return this.roleRepository.exists({ name }, { ...options, withDeleted: true });
  }

  /**
   * Update Role.
   *
   * @param repository role roleDoc
   * @param data RoleUpdateDto
   * @example await roleService.update(roleDoc, data)
   *
   * @returns Promise RoleDoc
   */
  async update(
    repository: RoleDoc,
    { name, description, type, permissions, isActive }: RoleUpdateDto,
  ): Promise<RoleDoc> {
    repository.name = name ?? repository.name;
    repository.description = description ?? repository.description;
    repository.type = type ?? repository.type;
    repository.permissions = permissions ?? repository.permissions;
    repository.isActive = isActive ?? repository.isActive;

    return this.roleRepository.save(repository);
  }

  /**
   * softDelete Role document
   *
   * @param repository RoleDoc
   * @returns Promise RoleDoc
   */
  async delete(repository: RoleDoc): Promise<RoleDoc> {
    return this.roleRepository.softDelete(repository);
  }

  /**
   * Update role inActive
   *
   * @param repository RoleDoc
   * @returns Promise RoleDoc
   */
  async inActive(repository: RoleDoc): Promise<RoleDoc> {
    repository.isActive = false;

    return this.roleRepository.save(repository);
  }

  /**
   * Update role active
   *
   * @param repository RoleDoc
   * @returns Promise RoleDoc
   */
  async active(repository: RoleDoc): Promise<RoleDoc> {
    repository.isActive = true;

    return this.roleRepository.save(repository);
  }

  /**
   * Update role permission and type
   *
   * @param repository RoleDoc
   * @param dto RoleUpdatePermissionsDto
   * @param dto.type ENUM_ROLE_TYPE
   * @param dto.permissions IPolicyRule[]
   *
   * @returns Promise RoleDoc
   */
  async updatePermissions(
    repository: RoleDoc,
    { type, permissions }: RoleUpdatePermissionsDto,
  ): Promise<RoleDoc> {
    repository.type = type;
    repository.permissions = permissions;

    return this.roleRepository.save(repository);
  }
}
