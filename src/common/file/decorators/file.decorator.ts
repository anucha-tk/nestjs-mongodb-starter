import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  FILE_CUSTOM_MAX_FILES_META_KEY,
  FILE_CUSTOM_MAX_SIZE_META_KEY,
} from "../constants/file.constant";
import { FileCustomMaxFilesInterceptor } from "../interceptors/file.custom-max-files.interceptor";
import { FileCustomMaxSizeInterceptor } from "../interceptors/file.custom-max-size.interceptor";

export function UploadFileSingle(field: string): MethodDecorator {
  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function FileCustomMaxFile(customMaxFiles: number): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileCustomMaxFilesInterceptor),
    SetMetadata(FILE_CUSTOM_MAX_FILES_META_KEY, customMaxFiles),
  );
}

export function FileCustomMaxSize(customMaxSize: string): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileCustomMaxSizeInterceptor),
    SetMetadata(FILE_CUSTOM_MAX_SIZE_META_KEY, customMaxSize),
  );
}
