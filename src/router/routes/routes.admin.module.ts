import { Module } from "@nestjs/common";
import { ApiKeyModule } from "src/common/api-key/api-key.module";
import { ApiKeyAdminController } from "src/common/api-key/controllers/api-key.admin.controller";
import { RoleAdminController } from "src/modules/role/controllers/role.admin.controller";
import { RoleModule } from "src/modules/role/role.module";
import { UserAdminController } from "src/modules/user/controllers/user.admin.controller";
import { UserModule } from "src/modules/user/user.module";

@Module({
  controllers: [RoleAdminController, UserAdminController, ApiKeyAdminController],
  providers: [],
  exports: [],
  imports: [RoleModule, UserModule, ApiKeyModule],
})
export class RoutesAdminModule {}
