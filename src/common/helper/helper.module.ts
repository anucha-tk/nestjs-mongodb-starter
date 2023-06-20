import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HelperArrayService } from "./services/helper.array.service";
import { HelperDateService } from "./services/helper.date.service";
import { HelperEncryptionService } from "./services/helper.encrypt.service";
import { HelperHashService } from "./services/helper.hash.service";
import { HelperNumberService } from "./services/helper.number.service";
import { HelperObjectService } from "./services/helper.object.service";
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
    HelperObjectService,
  ],
  exports: [
    HelperDateService,
    HelperArrayService,
    HelperNumberService,
    HelperStringService,
    HelperHashService,
    HelperEncryptionService,
    HelperObjectService,
  ],
  controllers: [],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("helper.jwt.defaultSecretKey"),
        signOptions: {
          expiresIn: configService.get<string>("helper.jwt.defaultExpirationTime"),
        },
      }),
    }),
  ],
})
export class HelperModule {}
