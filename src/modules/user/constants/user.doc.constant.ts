import { faker } from "@faker-js/faker";

export const UserDocParamsId = [
  {
    name: "user",
    allowEmptyValue: false,
    required: true,
    type: "string",
    example: faker.string.uuid(),
  },
];
