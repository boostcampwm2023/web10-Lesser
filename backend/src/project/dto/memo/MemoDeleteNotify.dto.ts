class Memo {
  id: number;
}

export class MemoDeleteNotifyDto {
  domain: string;
  action: string;
  content: Memo;
  static of(id: number) {
    const dto = new MemoDeleteNotifyDto();
    dto.domain = 'memo';
    dto.action = 'delete';
    dto.content = { id };
    return dto;
  }
}
