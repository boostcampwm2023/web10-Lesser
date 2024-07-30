import { EpicColor } from 'src/project/entity/epic.entity';

class Epic {
  id: number;
  name?: string;
  color?: EpicColor;
  rankValue?: string;
  static of(id: number, name: string, color: EpicColor, rankValue: string) {
    const dto = new Epic();
    dto.id = id;
    if (name !== undefined) dto.name = name;
    if (color !== undefined) dto.color = color;
    if (rankValue !== undefined) dto.rankValue = rankValue;
    return dto;
  }
}

export class EpicUpdateNotifyDto {
  domain: string;
  action: string;
  content: Epic;

  static of(id: number, name: string, color: EpicColor, rankValue: string) {
    const dto = new EpicUpdateNotifyDto();
    dto.domain = 'epic';
    dto.action = 'update';
    dto.content = Epic.of(id, name, color, rankValue);
    return dto;
  }
}
