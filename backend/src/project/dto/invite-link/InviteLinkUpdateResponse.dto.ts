class inviteLinkDto {
  inviteLinkId: string;

  static of(inviteLinkId: string): inviteLinkDto {
    const dto = new inviteLinkDto();
    dto.inviteLinkId = inviteLinkId;
    return dto;
  }
}

export class InviteLinkUpdateResponseDto {
  domain: string;
  action: string;
  content: inviteLinkDto;

  static of(inviteLinkId: string): InviteLinkUpdateResponseDto {
    const dto = new InviteLinkUpdateResponseDto();
    dto.domain = 'inviteLink';
    dto.action = 'update';
    dto.content = inviteLinkDto.of(inviteLinkId);
    return dto;
  }
}
