import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsNullOrIntAndNotEmpty', async: false })
export class IsNullOrIntAndNotEmpty implements ValidatorConstraintInterface {
  validate(data: any, args: ValidationArguments) {
    if (data === null || typeof data === 'number') return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'data ($value) is Not undefined and must null or int';
  }
}
