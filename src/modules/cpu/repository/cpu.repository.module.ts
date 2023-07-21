import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONNECTION_NAME } from "src/common/database/constants/database.constant";
import { CPUEntity, CPUSchema } from "./entities/cpu.entity";
import { CPURepository } from "./repositories/cpu.repository";

@Module({
  providers: [CPURepository],
  exports: [CPURepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CPUEntity.name,
          schema: CPUSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CPURepositoryModule {}
