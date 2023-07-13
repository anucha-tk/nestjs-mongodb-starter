import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { UserFaker } from "./user.faker";

/**
 * AuthFaker for testing.
 */
export class AuthFaker {
  private readonly BASE_LOGIN_URL = "/public/user/login";
  private readonly defaultPassword: string;

  constructor(private readonly app: INestApplication) {
    this.defaultPassword = UserFaker.password;
  }

  /**
   * supertest login.
   *
   * @param options Optional
   * @param options.email Optional email string
   * @param options.password Optional password string, default `UserFaker.password`
   * @param options.xApiKey Optional xApiKey string
   * @param options.auth Optional auth token string
   *
   * @returns Promise accessToken string
   */
  public async login({
    email,
    password = this.defaultPassword,
    xApiKey,
    auth,
  }: {
    email?: string;
    password?: string;
    xApiKey?: string;
    auth?: string;
  }): Promise<string> {
    const { body } = await request(this.app.getHttpServer())
      .post(this.BASE_LOGIN_URL)
      .send({ email, password })
      .set("x-api-key", xApiKey)
      .set("authorization", `Bearer ${auth}`);

    return body.data.accessToken;
  }
}
