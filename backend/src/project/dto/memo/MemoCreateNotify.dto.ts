import { Memo, memoColor } from '../../entity/memo.entity';

class MemoDto {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: string;
  color: memoColor;
}

export class MemoCreateNotifyDto {
  domain: string;
  action: string;
  content: MemoDto;
  static of(memo: Memo, author: string) {
    const dto = new MemoCreateNotifyDto();
    dto.domain = 'memo';
    dto.action = 'create';
    const { id, title, content, color } = memo;
    dto.content = {
      id,
      title,
      content,
      color,
      createdAt: memo.created_at,
      author,
    };
    return dto;
  }
}
