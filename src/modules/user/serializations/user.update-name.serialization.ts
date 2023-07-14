import { PickType } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { UserGetSerialization } from "./user.get.serialization";

@Exclude()
export class UserUpdateNameSerialization extends PickType(UserGetSerialization, [
  "_id",
  "firstName",
  "lastName",
]) {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}
