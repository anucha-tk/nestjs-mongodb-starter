import { Injectable, PipeTransform, UnsupportedMediaTypeException } from "@nestjs/common";
import { ENUM_FILE_IMAGE_MIME } from "../constants/file.enum.constant";
import { ENUM_FILE_STATUS_CODE_ERROR } from "../constants/file.status-code.constant";
import { IFile } from "../interfaces/file.interface";

/**
 * FileTypeImagePipe
 * check all file is image mime
 * @see image type `ENUM_FILE_IMAGE_MIME`
 * @throws 415 UnsupportedMediaTypeException
 */
@Injectable()
export class FileTypeImagePipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (!Object.values(ENUM_FILE_IMAGE_MIME).find((val) => val === mimetype.toLowerCase())) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: "file.error.mimeInvalid",
      });
    }

    return;
  }
}
