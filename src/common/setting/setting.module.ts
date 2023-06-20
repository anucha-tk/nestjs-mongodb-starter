import { Global, Module } from "@nestjs/common";
import { SettingService } from "./services/setting.service";

@Global()
@Module({
  imports: [],
  exports: [SettingService],
  providers: [SettingService],
})
export class SettingModule {}
