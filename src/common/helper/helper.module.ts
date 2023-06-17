import { Global, Module } from "@nestjs/common";
import { HelperArrayService } from "./services/helper.array.service";
import { HelperDateService } from "./services/helper.date.service";
import { HelperEncryptionService } from "./services/helper.encrypt.service";
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
    HelperEncryptionService,
  ],
  exports: [
    HelperDateService,
    HelperArrayService,
    HelperNumberService,
    HelperStringService,
    HelperHashService,
    HelperEncryptionService,
  ],
  controllers: [],
  imports: [],
})
export class HelperModule {}
