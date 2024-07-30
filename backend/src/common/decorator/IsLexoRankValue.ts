import { registerDecorator } from 'class-validator';

export function IsLexoRankValue() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsLexoRankValue',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: 'invalid LexoRank format' },
      validator: {
        validate(value: any) {
          const lexorankPattern = new RegExp(`^[012]\\|.*`, 'i');
          return lexorankPattern.test(value);
        },
      },
    });
  };
}
