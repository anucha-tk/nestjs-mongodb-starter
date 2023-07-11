import { PickType } from "@nestjs/swagger";
import { UserGetSerialization } from "./user.get.serialization";

export class UserUpdateNameSerialization extends PickType(UserGetSerialization, [
  "_id",
  "firstName",
  "lastName",
]) {}
