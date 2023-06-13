import { Global, Module } from "@nestjs/common";
import { HelperArrayService } from "./services/helper.array.service";
import { HelperDateService } from "./services/helper.date.service";
import { HelperHashService } from "./services/helper.hash.service";
import { HelperNumberService } from "./services/helper.number.service";
import { HelperStringService } from "./services/helper.string.service";

@Global()
@Module({
  providers: [
    HelperDateService,
    HelperArrayService,
    HelperNumberService,
    HelperStringService,
    HelperHashService,
  ],
  exports: [
    HelperDateService,
    HelperArrayService,
    HelperNumberService,
    HelperStringService,
    HelperHashService,
  ],
  controllers: [],
  imports: [],
})
export class HelperModule {}
