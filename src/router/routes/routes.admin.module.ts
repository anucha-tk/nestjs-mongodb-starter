import { Module } from "@nestjs/common";
import { RoleAdminController } from "src/modules/role/controllers/role.controller";
import { RoleModule } from "src/modules/role/role.module";

@Module({
  controllers: [RoleAdminController],
  providers: [],
  exports: [],
  imports: [RoleModule],
})
export class RoutesAdminModule {}
