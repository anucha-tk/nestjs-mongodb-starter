import { Module } from "@nestjs/common";
import { CommandModule } from "nestjs-command";
import { ApiKeyModule } from "src/common/api-key/api-key.module";
import { AuthModule } from "src/common/auth/auth.module";
import { CommonModule } from "src/common/common.module";
import { MigrationApiKeySeed } from "src/migration/seeds/migration.api-key.seed";
import { RoleModule } from "src/modules/role/role.module";
import { UserModule } from "src/modules/user/user.module";
import { MigrationRoleSeed } from "./seeds/migration.role.seed";
import { MigrationUserSeed } from "./seeds/migration.user.seed";

@Module({
  imports: [CommonModule, CommandModule, ApiKeyModule, RoleModule, UserModule, AuthModule],
  providers: [MigrationApiKeySeed, MigrationRoleSeed, MigrationUserSeed],
  exports: [],
})
export class MigrationModule {}
