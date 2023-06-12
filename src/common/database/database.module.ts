import { Module } from "@nestjs/common";
import { DatabaseOptionsService } from "./services/database.options.service";

@Module({
  providers: [DatabaseOptionsService],
  exports: [DatabaseOptionsService],
})
export class DatabaseOptionsModule {}
