import { RoleDoc, RoleEntity } from "src/modules/role/repository/entities/role.entity";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserDoc, UserEntity } from "../repository/entities/user.entity";

export interface IUserEntity extends Omit<UserEntity, "role"> {
  role: RoleEntity;
}

export interface IUserGoogleEntity {
  accessToken: string;
  refreshToken: string;
}

export interface IUserDoc extends Omit<UserDoc, "role"> {
  role: RoleDoc;
}

export type IUserCreate = Omit<UserCreateDto, "password">;
