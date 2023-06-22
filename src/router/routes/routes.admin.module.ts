import { Module } from "@nestjs/common";
import { RoleAdminController } from "src/modules/role/controllers/role.admin.controller";
import { RoleModule } from "src/modules/role/role.module";
import { UserAdminController } from "src/modules/user/controllers/user.admin.controller";
import { UserModule } from "src/modules/user/user.module";

@Module({
  controllers: [RoleAdminController, UserAdminController],
  providers: [],
  exports: [],
  imports: [RoleModule, UserModule],
})
export class RoutesAdminModule {}
