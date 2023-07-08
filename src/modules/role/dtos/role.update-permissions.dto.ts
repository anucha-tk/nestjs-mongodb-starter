import { OmitType } from "@nestjs/swagger";
import { RoleCreateDto } from "./role.create.dto";

/**
 * RoleUpdatePermissionsDto
 * @extends PartialType name RoleCreateDto
 */
export class RoleUpdatePermissionsDto extends OmitType(RoleCreateDto, ["name", "description"]) {}
