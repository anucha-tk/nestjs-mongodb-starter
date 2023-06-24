import { DynamicModule, Module, Provider } from "@nestjs/common";
import { AuthJwtAccessStrategy } from "src/common/auth/guards/jwt-access/auth.jwt-access.strategy";
import { AuthService } from "src/common/auth/services/auth.service";
import { AuthGoogleOAuth2LoginStrategy } from "./guards/google-oauth2/auth.google-oauth2-login.strategy";
import { AuthGoogleOAuth2SignUpStrategy } from "./guards/google-oauth2/auth.google-oauth2-sign-up.strategy";
import { AuthJwtRefreshStrategy } from "./guards/jwt-refresh/auth.jwt-refresh.strategy";

@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [],
  imports: [],
})
export class AuthModule {
  static forRoot(): DynamicModule {
    const providers: Provider<any>[] = [AuthJwtAccessStrategy, AuthJwtRefreshStrategy];

    if (process.env.SSO_GOOGLE_CLIENT_ID && process.env.SSO_GOOGLE_CLIENT_SECRET) {
      providers.push(AuthGoogleOAuth2LoginStrategy);
      providers.push(AuthGoogleOAuth2SignUpStrategy);
    }

    return {
      module: AuthModule,
      providers,
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
