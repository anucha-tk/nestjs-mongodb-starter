import { Module } from "@nestjs/common";
import { CPURepositoryModule } from "./repository/cpu.repository.module";
import { CPUService } from "./services/cpu.service";

@Module({
  controllers: [],
  providers: [CPUService],
  exports: [CPUService],
  imports: [CPURepositoryModule],
})
export class CPUModule {}
