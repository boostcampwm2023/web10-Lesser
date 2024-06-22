class Link {
  id: number;
}

export class LinkDeleteNotifyDto {
  domain: string;
  action: string;
  content: Link;

  static of(id: number) {
    const dto = new LinkDeleteNotifyDto();
    dto.domain = 'link';
    dto.action = 'delete';
    dto.content = { id };
    return dto;
  }
}
