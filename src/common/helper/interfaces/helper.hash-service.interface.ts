export interface IHelperHashService {
  sha256(string: string): string;
  sha256Compare(hashOne: string, hashTwo: string): boolean;
}
