export interface IHelperEncryptionService {
  aes256Encrypt(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string,
  ): string;
  aes256Decrypt(
    encrypted: string,
    key: string,
    iv: string,
  ): string | Record<string, any> | Record<string, any>[];
}
