import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ENUM_REQUEST_STATUS_CODE_ERROR } from "./constants/request.status-code.constant";
import { RequestTimeoutInterceptor } from "./interceptors/request.timeout.interceptor";
import { RequestMiddlewareModule } from "./middlewares/request.middleware.module";
import { MinDateTodayConstraint } from "./validations/request.min-date-today.validation";
import { MinGreaterThanEqualConstraint } from "./validations/request.min-greater-than-equal.validation";

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTimeoutInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          skipNullProperties: false,
          skipUndefinedProperties: false,
          skipMissingProperties: false,
          forbidUnknownValues: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: async (errors: ValidationError[]) =>
            new UnprocessableEntityException({
              statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
              message: "request.validation",
              errors,
            }),
        }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    MinDateTodayConstraint,
    MinGreaterThanEqualConstraint,
  ],
  imports: [
    RequestMiddlewareModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get("request.throttle.ttl"),
        limit: config.get("request.throttle.limit"),
      }),
    }),
  ],
})
export class RequestModule {}
