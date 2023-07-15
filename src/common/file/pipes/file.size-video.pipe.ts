import { Inject, Injectable, PayloadTooLargeException, PipeTransform, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { HelperFileService } from "src/common/helper/services/helper.file.service";
import { ENUM_FILE_STATUS_CODE_ERROR } from "../constants/file.status-code.constant";
import { IFile } from "../interfaces/file.interface";

/**
 * FileSizeVideoPipe.
 * check all videos is not grater than maxSize
 * @description `__customMaxFileSize` custom max file type use `@FileCustomMaxSize()` decorator
 * @default maxSize 5.5mb (on config file.video.maxFileSize)
 * @throws 413 PayloadTooLargeException
 */
@Injectable({ scope: Scope.REQUEST })
export class FileSizeVideoPipe implements PipeTransform {
  private readonly maxSize: number;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {
    this.maxSize = this.configService.get<number>("file.video.maxFileSize");
  }

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customMaxFileSize
      ? this.helperFileService.convertToBytes(this.request.__customMaxFileSize)
      : this.maxSize;

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_SIZE_ERROR,
        message: "file.error.maxSize",
      });
    }

    return;
  }
}
