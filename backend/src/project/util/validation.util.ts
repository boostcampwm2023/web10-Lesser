import { ValidationError } from 'class-validator';

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
