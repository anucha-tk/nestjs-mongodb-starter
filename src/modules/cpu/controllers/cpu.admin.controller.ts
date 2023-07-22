import { Controller, Post, UploadedFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiKeyPublicProtected } from "src/common/api-key/decorators/api-key.decorator";
import { AuthJwtAdminAccessProtected } from "src/common/auth/decorators/auth.jwt.decorator";
import { UploadFileSingle } from "src/common/file/decorators/file.decorator";
import { IFileExtract } from "src/common/file/interfaces/file.interface";
import { FileExtractPipe } from "src/common/file/pipes/file.extract.pipe";
import { FileRequiredPipe } from "src/common/file/pipes/file.required.pipe";
import { FileSizeExcelPipe } from "src/common/file/pipes/file.size-excel.pipe";
import { FileTypeExcelPipe } from "src/common/file/pipes/file.type-excel.pipe";
import { FileValidationPipe } from "src/common/file/pipes/file.validation.pipe";
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_SUBJECT,
} from "src/common/policy/constants/policy.enum.constant";
import { PolicyAbilityProtected } from "src/common/policy/decorators/policy.decorator";
import { Response } from "src/common/response/decorators/response.decorator";
import { CPUAdminImportDoc } from "../docs/cpu.admin.doc";
import { CPUImportDto } from "../dtos/cpu.import.dto";
import { CPUService } from "../services/cpu.service";

@ApiKeyPublicProtected()
@ApiTags("modules.admin.cpu")
@Controller({
  version: "1",
  path: "/cpu",
})
export class CPUAdminController {
  constructor(private readonly cPUService: CPUService) {}

  @CPUAdminImportDoc()
  @Response("cpu.import")
  @UploadFileSingle("file")
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.CPU,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE, ENUM_POLICY_ACTION.IMPORT],
  })
  @AuthJwtAdminAccessProtected()
  @Post("/import")
  async list(
    @UploadedFile(
      FileRequiredPipe,
      FileSizeExcelPipe,
      FileTypeExcelPipe,
      FileExtractPipe,
      new FileValidationPipe<CPUImportDto>(CPUImportDto),
    )
    file: IFileExtract<CPUImportDto>,
  ): Promise<void> {
    await this.cPUService.import(file.dto);
    return;
  }
}
