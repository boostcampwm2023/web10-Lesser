import { Story, StoryStatus } from 'src/project/entity/story.entity';
class StoryDto {
  id: number;
  title: string;
  point: number;
  status: StoryStatus;
  epicId: number;
  rankValue: string;

  static of(story: Story) {
    const dto = new StoryDto();
    dto.id = story.id;
    dto.title = story.title;
    dto.point = story.point;
    dto.status = story.status;
    dto.epicId = story.epicId;
    dto.rankValue = story.rankValue;
    return dto;
  }
}

export class StoryCreateNotifyDto {
  domain: string;
  action: string;
  content: StoryDto;

  static of(story: Story) {
    const dto = new StoryCreateNotifyDto();
    dto.domain = 'story';
    dto.action = 'create';
    dto.content = StoryDto.of(story);
    return dto;
  }
}
