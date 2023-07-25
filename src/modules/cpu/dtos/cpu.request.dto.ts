import { Type } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CPURequestDto {
  @IsNotEmpty()
  @IsUUID("4")
  @Type(() => String)
  cpu: string;
}
