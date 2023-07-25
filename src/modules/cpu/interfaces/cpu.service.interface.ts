import { IDatabaseFindOneOptions } from "src/common/database/interfaces/database.interface";
import { CPUCreateDto } from "../dtos/cpu.create.dto";
import { CPUImportDto } from "../dtos/cpu.import.dto";
import { CPUDoc } from "../repository/entities/cpu.entity";

export interface ICPUService {
  import(data: CPUImportDto[]): Promise<boolean>;
  findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  create(data: CPUCreateDto): Promise<CPUDoc>;
  deleteMany(find: Record<string, any>): Promise<boolean>;
}
