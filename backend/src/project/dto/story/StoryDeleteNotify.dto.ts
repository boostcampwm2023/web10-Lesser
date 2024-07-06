class Story {
  id: number;
  static of(id: number) {
    const dto = new Story();
    dto.id = id;
    return dto;
  }
}

export class StoryDeleteNotifyDto {
  domain: string;
  action: string;
  content: Story;

  static of(id: number) {
    const dto = new StoryDeleteNotifyDto();
    dto.domain = 'story';
    dto.action = 'delete';
    dto.content = Story.of(id);
    return dto;
  }
}
