import { RoleEntity } from "src/modules/role/repository/entities/role.entity";
import { UserEntity } from "../repository/entities/user.entity";

export interface IUserEntity extends Omit<UserEntity, "role"> {
  role: RoleEntity;
}

export interface IUserGoogleEntity {
  accessToken: string;
  refreshToken: string;
}
