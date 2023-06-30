import { Injectable, CanActivate, ExecutionContext, NotFoundException } from "@nestjs/common";
import { ENUM_API_KEY_STATUS_CODE_ERROR } from "src/common/api-key/constants/api-key.status-code.constant";

/**
 * Guard check exists `__apiKey`
 * @throws 404 `ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR`
 */
@Injectable()
export class ApiKeyNotFoundGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __apiKey } = context.switchToHttp().getRequest();

    if (!__apiKey) {
      throw new NotFoundException({
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR,
        message: "apiKey.error.notFound",
      });
    }
    return true;
  }
}
