import { ValidationError } from "class-validator";
import {
  IErrors,
  IErrorsImport,
  IValidationErrorImport,
} from "src/common/error/interfaces/error.interface";
import { IMessageErrorOptions, IMessageOptions, IMessageSetOptions } from "./message.interface";

export interface IMessageService {
  getAvailableLanguages(): string[];
  getLanguage(): string;
  filterLanguage(customLanguages: string[]): string[];
  setMessage(lang: string, key: string, options?: IMessageSetOptions): string;
  get<T = string>(key: string, options?: IMessageOptions): T;
  getRequestErrorsMessage(
    requestErrors: ValidationError[],
    options?: IMessageErrorOptions,
  ): IErrors[];
  getImportErrorsMessage(
    errors: IValidationErrorImport[],
    options?: IMessageErrorOptions,
  ): IErrorsImport[];
}
