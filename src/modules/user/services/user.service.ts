import { Injectable } from "@nestjs/common";
import { IDatabaseFindAllOptions } from "src/common/database/interfaces/database.interface";
import { IUserEntity } from "../interfaces/user.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { UserRepository } from "../repository/repositories/user.repository";

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserEntity[]> {
    return this.userRepository.findAll<IUserEntity>(find, {
      ...options,
      join: true,
    });
  }
}
