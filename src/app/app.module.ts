import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { RouterModule } from "src/router/router.module";
import { AppController } from "./controllers/app.controller";

@Module({
  imports: [CommonModule, RouterModule.forRoot()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
