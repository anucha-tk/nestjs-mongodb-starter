import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import Joi from "joi";
import { APP_LANGUAGE } from "src/app/constants/app.constant";
import { ENUM_APP_ENVIRONMENT } from "src/app/constants/app.enum.constant";
import configs from "src/configs";
import { ENUM_MESSAGE_LANGUAGE } from "./message/constants/message.enum.constant";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: [".env"],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid(...Object.values(ENUM_APP_ENVIRONMENT))
          .default("development")
          .required(),
        APP_LANGUAGE: Joi.string()
          .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
          .default(APP_LANGUAGE)
          .required(),

        HTTP_ENABLE: Joi.boolean().default(true).required(),
        HTTP_HOST: [
          Joi.string().ip({ version: "ipv4" }).required(),
          Joi.valid("localhost").required(),
        ],
        HTTP_PORT: Joi.number().required(),
        HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
        HTTP_VERSION: Joi.number().required(),

        DATABASE_HOST: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USER: Joi.string().allow(null, "").optional(),
        DATABASE_PASSWORD: Joi.string().optional(),
        DATABASE_DEBUG: Joi.boolean().default(false).required(),
        DATABASE_OPTIONS: Joi.string().allow(null, "").optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class CommonModule {}
