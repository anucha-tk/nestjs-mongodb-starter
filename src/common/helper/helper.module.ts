import { Global, Module } from "@nestjs/common";
import { HelperArrayService } from "./services/helper.array.service";
import { HelperDateService } from "./services/helper.date.service";
import { HelperNumberService } from "./services/helper.number.service";

@Global()
@Module({
  providers: [HelperDateService, HelperArrayService, HelperNumberService],
  exports: [HelperDateService, HelperArrayService, HelperNumberService],
  controllers: [],
  imports: [],
})
export class HelperModule {}
