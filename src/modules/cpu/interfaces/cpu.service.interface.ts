import { CPUImportDto } from "../dtos/cpu.import.dto";

export interface ICPUService {
  import(data: CPUImportDto[]): Promise<boolean>;
}
