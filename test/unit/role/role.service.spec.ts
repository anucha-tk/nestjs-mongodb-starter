import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { ENUM_ROLE_TYPE } from "src/modules/role/constants/role.enum.constant";
import { RoleService } from "src/modules/role/services/role.service";
import {
  RoleDatabaseName,
  RoleEntity,
  RoleSchema,
} from "src/modules/role/repository/entities/role.entity";
import { RoleRepository } from "src/modules/role/repository/repositories/role.repository";
import mongoose from "mongoose";
import { RoleCreateDto } from "src/modules/role/dtos/role.create.dto";

describe("role service", () => {
  let roleService: RoleService;
  let roleRepository: RoleRepository;
  const roleKeyId = faker.string.uuid();
  const roleKeyEntityDoc = new mongoose.Mongoose().model(RoleDatabaseName, RoleSchema);

  beforeAll(async () => {
    const modRef: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: {
            create: jest.fn().mockImplementation(({ name, description, type, permissions }) => {
              const find = new roleKeyEntityDoc();
              find._id = roleKeyId;
              find.name = name;
              find.description = description;
              find.type = type;
              find.permissions = permissions;

              return find;
            }),
            createMany: jest.fn().mockImplementation(() => true),
          },
        },
      ],
    }).compile();

    roleService = modRef.get<RoleService>(RoleService);
    roleRepository = modRef.get<RoleRepository>(RoleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return RoleDoc when create successful", async () => {
      const dto: RoleCreateDto = {
        name: faker.word.words(),
        description: faker.word.words(3),
        type: ENUM_ROLE_TYPE.SUPER_ADMIN,
        permissions: [
          {
            subject: ENUM_POLICY_SUBJECT.API_KEY,
            action: [ENUM_POLICY_ACTION.MANAGE],
          },
        ],
      };

      const result: RoleEntity = await roleService.create(dto);

      expect(roleRepository.create).toHaveBeenCalled();
      expect(result.name).toBe(dto.name);
      expect(result.description).toBe(dto.description);
      expect(result.type).toBe(dto.type);
      expect(result.permissions).toMatchObject({ ...dto.permissions });
    });
  });

  describe("createMany", () => {
    it("should return true when createMany successful", async () => {
      const dtos: RoleCreateDto[] = [
        {
          name: faker.word.words(),
          description: faker.word.words(3),
          type: ENUM_ROLE_TYPE.SUPER_ADMIN,
          permissions: [
            {
              subject: ENUM_POLICY_SUBJECT.API_KEY,
              action: [ENUM_POLICY_ACTION.MANAGE],
            },
          ],
        },
        {
          name: faker.word.words(),
          description: faker.word.words(3),
          type: ENUM_ROLE_TYPE.SUPER_ADMIN,
          permissions: [
            {
              subject: ENUM_POLICY_SUBJECT.API_KEY,
              action: [ENUM_POLICY_ACTION.MANAGE],
            },
          ],
        },
      ];

      const result = await roleService.createMany(dtos);

      expect(roleRepository.createMany).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });
  });
});
