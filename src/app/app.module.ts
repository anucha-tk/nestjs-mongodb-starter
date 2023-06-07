import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { AppController } from "./controllers/app.controller";

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
