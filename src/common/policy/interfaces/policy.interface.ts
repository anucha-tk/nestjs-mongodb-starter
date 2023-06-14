import { ENUM_POLICY_ACTION, ENUM_POLICY_SUBJECT } from "../constants/policy.enum.constant";

export interface IPolicyRule {
  subject: ENUM_POLICY_SUBJECT;
  action: ENUM_POLICY_ACTION[];
}
