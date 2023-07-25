import { faker } from "@faker-js/faker";

const multiQueryOperatorsDescription = `
Advanced multi query operator use array object.
\n **Operators is:**
- \\= Matches values that are equal to a specified value.
- \\> Matches values that are greater than a specified value.
- \\>= Matches values that are greater than or equal to a specified value.
- \\< Matches values that are less than a specified value.
- \\<= Matches values that are less than or equal to a specified value.
- \\!= Matches none of the values specified in an array.
`;

export const MultiQueryOperators = [
  {
    name: "multiQueryOperators",
    allowEmptyValue: true,
    required: false,
    type: "string",
    example: `[{"field":"lithography","operator":">=","value":"12"},{"field":"lithography","operator":"<=","value":"24"}]`,
    description: multiQueryOperatorsDescription,
  },
];

export const CPUDocParamsId = [
  {
    name: "cpu",
    allowEmptyValue: false,
    required: true,
    type: "string",
    example: faker.string.uuid(),
  },
];
