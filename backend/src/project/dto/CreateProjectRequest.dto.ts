import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Title is too long' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Subject is too long' })
  subject: string;
}
