import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { ENUM_API_KEY_TYPE } from "src/common/api-key/constants/api-key.enum.constant";
import { ApiKeyService } from "src/common/api-key/services/api-key.service";

/**
 * Create ApiKey
 * @default type - ENUM_API_KEY_TYPE.PUBLIC
 * */
export const createApiKey = async (app: INestApplication, type = ENUM_API_KEY_TYPE.PUBLIC) => {
  const apiKeyService = app.get(ApiKeyService);
  try {
    const apikey = await apiKeyService.createRaw({
      name: "api key from createApiKey",
      type,
      key: faker.string.alphanumeric(20),
      secret: faker.string.alphanumeric(20),
      startDate: faker.date.recent({ days: 7 }),
      endDate: faker.date.future({ years: 0.5 }),
    });
    return apikey;
  } catch (error) {
    console.log(error);
  }
};
