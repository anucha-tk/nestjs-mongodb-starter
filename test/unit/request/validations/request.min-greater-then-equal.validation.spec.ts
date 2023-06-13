import { ValidationArguments } from "class-validator";
import {
  MinGreaterThanEqual,
  MinGreaterThanEqualConstraint,
} from "src/common/request/validations/request.min-greater-than-equal.validation";

describe("MinGreaterThanEqual", () => {
  const propertyName = "myProperty";
  const relatedPropertyName = "relatedProperty";

  class TestClass {
    @MinGreaterThanEqual(relatedPropertyName)
    [propertyName]: string;

    [relatedPropertyName]: string;
  }

  const validatorConstraint = new MinGreaterThanEqualConstraint();

  it("should pass validation when value is greater than or equal to related property", () => {
    const object = new TestClass();
    object[propertyName] = "2022-01-01";
    object[relatedPropertyName] = "2021-12-31";

    const validationArguments: ValidationArguments = {
      object,
      property: propertyName,
      constraints: [relatedPropertyName],
      value: object[propertyName],
      targetName: undefined,
    };

    const isValid = validatorConstraint.validate(object[propertyName], validationArguments);

    expect(isValid).toBe(true);
  });

  it("should pass validation when value is equal to related property", () => {
    const object = new TestClass();
    object[propertyName] = "2022-01-01";
    object[relatedPropertyName] = "2022-01-01";

    const validationArguments: ValidationArguments = {
      object,
      property: propertyName,
      constraints: [relatedPropertyName],
      value: object[propertyName],
      targetName: undefined,
    };

    const isValid = validatorConstraint.validate(object[propertyName], validationArguments);

    expect(isValid).toBe(true);
  });

  it("should fail validation when value is less than related property", () => {
    const object = new TestClass();
    object[propertyName] = "2021-12-31";
    object[relatedPropertyName] = "2022-01-01";

    const validationArguments = {
      object,
      property: propertyName,
      constraints: [relatedPropertyName],
      value: object[propertyName],
      targetName: undefined,
    };

    const isValid = validatorConstraint.validate(object[propertyName], validationArguments);

    expect(isValid).toBe(false);
  });
});
