import { registerAs } from "@nestjs/config";
import { seconds } from "src/common/helper/constants/helper.function.constant";

export default registerAs(
  "auth",
  (): Record<string, any> => ({
    accessToken: {
      secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY ?? "123456",
    },
    subject: process.env.AUTH_JWT_SUBJECT,
    audience: process.env.AUTH_JWT_AUDIENCE,
    issuer: process.env.AUTH_JWT_ISSUER,
    prefixAuthorization: "Bearer",
    payloadEncryption: process.env.AUTH_JWT_PAYLOAD_ENCRYPT === "true" ? true : false,

    password: {
      attempt: true,
      maxAttempt: 5,
      saltLength: 8,
      expiredIn: seconds("182d"), // 182 days
    },
  }),
);
