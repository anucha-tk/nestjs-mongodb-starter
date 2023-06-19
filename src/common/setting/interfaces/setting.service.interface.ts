export interface ISettingService {
  getPasswordAttempt(): Promise<boolean>;
  getMaxPasswordAttempt(): Promise<number>;
}
