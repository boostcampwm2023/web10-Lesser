import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  registerDecorator,
  ValidateNested,
} from 'class-validator';

function IsURL() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsURL',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: 'invalid url format' },
      validator: {
        validate(value: any) {
          const URLPattern = new RegExp(
            '^((?:http|https)://)' +
              '(?:\\S+(?::\\S*)?@)?' +
              '(?:(?:' +
              '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
              '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
              '(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
              '|' +
              '(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)' +
              '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*' +
              '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
              ')|' +
              'localhost' +
              ')' +
              '(?::\\d{2,5})?' +
              '(?:(/|\\?|#)[^\\s]*)?$',
            'i',
          );
          return URLPattern.test(value);
        },
      },
    });
  };
}

class Link {
  @IsString()
  @IsURL()
  @Length(0, 255)
  url: string;

  @IsString()
  @Length(0, 255)
  description: string;
}

export class LinkCreateRequestDto {
  @Matches(/^create$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Link)
  content: Link;
}
