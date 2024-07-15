import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { TaskStatus } from 'src/project/entity/task.entity';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsOneDecimalPlace(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOneDecimalPlace',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const decimalPattern = /^\d+(\.\d{1})?$/;
          return (
            typeof value === 'number' && decimalPattern.test(value.toString())
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a number with exactly one decimal place`;
        },
      },
    });
  };
}

class Task {
  @IsString()
  @Length(1, 100, { message: 'Title must be 100 characters or less' })
  title: string;

  @IsOptional()
  @IsOneDecimalPlace()
  expectedTime: number;

  @IsOptional()
  @IsOneDecimalPlace()
  actualTime: number;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsInt()
  assignedMemberId: number;

  @IsInt()
  storyId: number;
}

export class TaskCreateRequestDto {
  @Matches(/^create$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Task)
  content: Task;
}
