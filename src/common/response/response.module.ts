import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseCustomHeadersInterceptor } from "./interceptors/response.custom-headers.interceptor";
import { ResponseMiddlewareModule } from "./middlewares/response.middleware.module";

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseCustomHeadersInterceptor,
    },
  ],
  imports: [ResponseMiddlewareModule],
})
export class ResponseModule {}
