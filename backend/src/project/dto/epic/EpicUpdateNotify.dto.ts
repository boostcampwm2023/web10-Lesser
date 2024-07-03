import { EpicColor } from 'src/project/entity/epic.entity';

class Epic {
  id: number;
  name?: string;
  color?: EpicColor;
  static of(id: number, name: string, color: EpicColor) {
    const dto = new Epic();
    dto.id = id;
    if (name) dto.name = name;
    if (color) dto.color = color;
    return dto;
  }
}

export class EpicUpdateNotifyDto {
  domain: string;
  action: string;
  content: Epic;

  static of(id: number, name: string, color: EpicColor) {
    const dto = new EpicUpdateNotifyDto();
    dto.domain = 'epic';
    dto.action = 'update';
    dto.content = Epic.of(id, name, color);
    return dto;
  }
}
