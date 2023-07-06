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
import { RoleUpdateDto } from "src/modules/role/dtos/role.update.dto";

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
            findAll: jest.fn().mockImplementation(() => {
              return [
                { _id: roleKeyId, name: "role_one" },
                { _id: roleKeyId, name: "role_two" },
              ];
            }),
            findOne: jest.fn().mockImplementation(({ _id, name }) => {
              const find = new roleKeyEntityDoc();
              find._id = _id;
              find.name = name;
              find.description = faker.lorem.sentence();
              find.isActive = faker.datatype.boolean();
              find.type = faker.helpers.arrayElement(Object.values(ENUM_ROLE_TYPE));
              find.permissions = [
                {
                  subject: faker.helpers.arrayElement(Object.values(ENUM_POLICY_SUBJECT)),
                  action: faker.helpers.arrayElements(Object.values(ENUM_POLICY_ACTION)),
                },
              ];

              return find;
            }),
            getTotal: jest.fn().mockResolvedValue(1),
            exists: jest.fn().mockResolvedValue(true),
            save: jest
              .fn()
              .mockImplementation(({ name, description, type, permissions, isActive }) => {
                const find = new roleKeyEntityDoc();
                find._id = roleKeyId;
                find.name = name;
                find.description = description;
                find.type = type;
                find.permissions = permissions;
                find.isActive = isActive;

                return find;
              }),
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

  describe("find", () => {
    describe("findAll", () => {
      it("should return roleDoc when findAll successful", async () => {
        const result = await roleService.findAll();
        expect(result).toBeDefined();
        expect(result).toEqual([
          { _id: roleKeyId, name: "role_one" },
          { _id: roleKeyId, name: "role_two" },
        ]);
        expect(roleRepository.findAll).toHaveBeenCalled();
      });
    });
    describe("findOneByName", () => {
      it("should return roleDoc when findOneByName successful", async () => {
        const result = await roleService.findOneByName("xyz");
        expect(result).toBeDefined();
        expect(result.name).toBe("xyz");
        expect(result).toBeInstanceOf(roleKeyEntityDoc);
        expect(roleRepository.findOne).toHaveBeenCalled();
      });
    });
  });

  describe("getTotal", () => {
    it("should count total", async () => {
      const result = await roleService.getTotal();

      expect(roleRepository.getTotal).toBeCalled();
      expect(result).toBe(1);
    });
  });

  describe("findOneById", () => {
    it("should return role", async () => {
      const result = await roleService.findOneById("123");

      expect(result).toBeDefined();
      expect(result._id).toBe("123");
      expect(result).toBeInstanceOf(roleKeyEntityDoc);
      expect(roleRepository.findOne).toBeCalled();
    });
  });

  describe("existByName", () => {
    it("should return result boolean", async () => {
      jest.spyOn(roleService, "existByName");
      const result = await roleService.existByName("abc");

      expect(result).toBeDefined();
      expect(typeof result).toBe("boolean");
      expect(roleRepository.exists).toBeCalled();
      expect(roleService.existByName).toBeCalled();
      expect(roleService.existByName).toBeCalledWith("abc");
      expect(roleRepository.exists).toBeCalledWith({ name: "abc" }, { withDeleted: true });
    });
  });

  describe("update", () => {
    it("should return roleDoc when create successful", async () => {
      jest.spyOn(roleService, "update");
      const updateRoleDto: RoleUpdateDto = {
        name: faker.word.words(),
        description: faker.word.words(3),
        type: ENUM_ROLE_TYPE.SUPER_ADMIN,
        permissions: [
          {
            subject: ENUM_POLICY_SUBJECT.API_KEY,
            action: [ENUM_POLICY_ACTION.MANAGE],
          },
        ],
        isActive: false,
      };
      const result = await roleService.update(new roleKeyEntityDoc(), updateRoleDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty("_id");
      expect(result).toHaveProperty("name");
      expect(result).toHaveProperty("type");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("isActive");
      expect(roleRepository.save).toBeCalled();
      expect(roleService.update).toBeCalled();
    });
  });
});
