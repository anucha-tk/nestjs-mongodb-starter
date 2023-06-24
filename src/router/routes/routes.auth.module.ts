import { Module } from "@nestjs/common";
import { AuthModule } from "src/common/auth/auth.module";
import { UserAuthController } from "src/modules/user/controllers/user.auth.controller";
import { UserModule } from "src/modules/user/user.module";

@Module({
  controllers: [UserAuthController],
  providers: [],
  exports: [],
  imports: [UserModule, AuthModule],
})
export class RoutesAuthModule {}
