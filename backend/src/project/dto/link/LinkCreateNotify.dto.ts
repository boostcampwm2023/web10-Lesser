class Link {
  id: number;
  url: string;
  description: string;
}

export class LinkCreateNotifyDto {
  domain: string;
  action: string;
  content: Link;

  static of(id: number, url: string, description: string) {
    const dto = new LinkCreateNotifyDto();
    dto.domain = 'link';
    dto.action = 'create';
    dto.content = { id, url, description };
    return dto;
  }
}
