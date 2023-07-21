import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { DatabaseMongoUUIDRepositoryAbstract } from "src/common/database/abstracts/mongo/repositories/database.mongo.uuid.repository.abstract";
import { DatabaseModel } from "src/common/database/decorators/database.decorator";
import { CPUDoc, CPUEntity } from "../entities/cpu.entity";

@Injectable()
export class CPURepository extends DatabaseMongoUUIDRepositoryAbstract<CPUEntity, CPUDoc> {
  constructor(
    @DatabaseModel(CPUEntity.name)
    private readonly cpuModel: Model<CPUEntity>,
  ) {
    super(cpuModel);
  }
}
