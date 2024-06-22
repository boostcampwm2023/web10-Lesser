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
            '^(https?:\\/\\/)' +
              '((([a-z\\d가-힣]([a-z\\d가-힣-]*[a-z\\d가-힣])*)\\.?)+[a-z가-힣]{2,}|' +
              '((\\d{1,3}\\.){3}\\d{1,3}))' +
              '(\\:\\d+)?' +
              '(\\/[-a-z\\d%_.~+가-힣]*)*' +
              '(\\?[;&a-z\\d%_.~+=-가-힣]*)?' +
              '(\\#[-a-z\\d_가-힣]*)?$',
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
