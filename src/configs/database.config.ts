import { registerAs } from "@nestjs/config";

export default registerAs(
  "database",
  (): Record<string, any> => ({
    host: process.env?.DATABASE_HOST,
    name: process.env?.DATABASE_NAME,
    user: process.env?.DATABASE_USER,
    password: process?.env.DATABASE_USER_PWD,
    debug: process.env.DATABASE_DEBUG === "true",
    options: process.env?.DATABASE_OPTIONS,
  }),
);
