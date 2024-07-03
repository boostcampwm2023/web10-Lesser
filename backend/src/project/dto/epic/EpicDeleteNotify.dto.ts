class Epic {
  id: number;
  static of(id: number) {
    const dto = new Epic();
    dto.id = id;
    return dto;
  }
}

export class EpicDeleteNotifyDto {
  domain: string;
  action: string;
  content: Epic;

  static of(id: number) {
    const dto = new EpicDeleteNotifyDto();
    dto.domain = 'epic';
    dto.action = 'delete';
    dto.content = Epic.of(id);
    return dto;
  }
}
