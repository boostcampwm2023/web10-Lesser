import { EpicColor } from 'src/project/entity/epic.entity';

class Epic {
  id: number;
  name: string;
  color: EpicColor;
  rankValue: string;

  static of(id: number, name: string, color: EpicColor, rankValue: string) {
    const dto = new Epic();
    dto.id = id;
    dto.name = name;
    dto.color = color;
    dto.rankValue = rankValue;
    return dto;
  }
}

export class EpicCreateNotifyDto {
  domain: string;
  action: string;
  content: Epic;

  static of(id: number, name: string, color: EpicColor, rankValue: string) {
    const dto = new EpicCreateNotifyDto();
    dto.domain = 'epic';
    dto.action = 'create';
    dto.content = Epic.of(id, name, color, rankValue);
    return dto;
  }
}
