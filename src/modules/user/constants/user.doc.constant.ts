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

export const UserDocQueryIsActive = [
  {
    name: "isActive",
    allowEmptyValue: true,
    required: false,
    type: "string",
    example: "true,false",
    description: "boolean value with ',' delimiter",
  },
];

export const UserDocQueryBlocked = [
  {
    name: "blocked",
    allowEmptyValue: true,
    required: false,
    type: "string",
    example: "true,false",
    description: "boolean value with ',' delimiter",
  },
];

export const UserDocQueryInactivePermanent = [
  {
    name: "inactivePermanent",
    allowEmptyValue: true,
    required: false,
    type: "string",
    example: "true,false",
    description: "boolean value with ',' delimiter",
  },
];

export const UserDocQueryRole = [
  {
    name: "role",
    allowEmptyValue: true,
    required: false,
    type: "string",
    example: faker.string.uuid(),
    description: "role uuid string for query",
  },
];

export const UserDocQueryJoin = [
  {
    name: "join",
    allowEmptyValue: true,
    required: false,
    type: "boolean",
    example: faker.datatype.boolean(),
    description: "boolean value for join on documents",
  },
];
