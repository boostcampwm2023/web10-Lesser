import { EpicColor } from 'src/project/entity/epic.entity';

class Epic {
  id: number;
  name: string;
  color: EpicColor;
  static of(id: number, name: string, color: EpicColor) {
    const dto = new Epic();
    dto.id = id;
    dto.name = name;
    dto.color = color;
    return dto;
  }
}

export class EpicCreateNotifyDto {
  domain: string;
  action: string;
  content: Epic;

  static of(id: number, name: string, color: EpicColor) {
    const dto = new EpicCreateNotifyDto();
    dto.domain = 'epic';
    dto.action = 'create';
    dto.content = Epic.of(id, name, color);
    return dto;
  }
}
