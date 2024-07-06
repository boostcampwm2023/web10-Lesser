import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Matches, ValidateNested } from 'class-validator';

class Story {
  @IsInt()
  id: number;
}

export class StoryDeleteRequestDto {
  @Matches(/^delete$/)
  action: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Story)
  content: Story;
}
