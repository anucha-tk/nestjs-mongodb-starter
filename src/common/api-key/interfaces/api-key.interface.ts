import { ENUM_API_KEY_TYPE } from "../constants/api-key.enum.constant";
import { ApiKeyDoc } from "../repository/entities/api-key.entity";

export interface IApiKeyPayload {
  _id: string;
  key: string;
  type: ENUM_API_KEY_TYPE;
  name: string;
}

export interface IApiKeyCreated {
  secret: string;
  doc: ApiKeyDoc;
}
