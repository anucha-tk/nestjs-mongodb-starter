import { Module } from "@nestjs/common";
import { MessagePublicController } from "src/common/message/controllers/message.public.controller";

@Module({
  controllers: [MessagePublicController],
  providers: [],
  exports: [],
  imports: [],
})
export class RoutesPublicModule {}
