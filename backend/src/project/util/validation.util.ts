import { registerDecorator, ValidationArguments, ValidationError, ValidationOptions } from 'class-validator';

export function getRecursiveErrorMsgList(errors: ValidationError[]): string[] {
  return errors.reduce((acc, error) => {
    if (error.children && error.children.length > 0) {
      acc = acc.concat(getRecursiveErrorMsgList(error.children));
    }
    if (error.constraints) {
      acc = acc.concat(Object.values(error.constraints));
    }
    return acc;
  }, []);
}

export function AtLeastOneProperty(
	properties: string[],
	validationOptions?: ValidationOptions
  ) {
	return function (object: Object, propertyName: string) {
	  registerDecorator({
		name: 'atLeastOneProperty',
		target: object.constructor,
		propertyName: propertyName,
		options: validationOptions,
		constraints: [properties],
		validator: {
		  validate(value: any, args: ValidationArguments) {
			const object = args.object as any;
			return properties.some((property) => object[property] !== undefined);
		  },
		  defaultMessage(args: ValidationArguments) {
			const properties = args.constraints[0];
			return `At least one of these properties must be provided: ${properties.join(', ')}`;
		  },
		},
	  });
	};
  }