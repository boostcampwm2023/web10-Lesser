import { MemberStatus } from "../../enum/MemberStatus.enum";

class Member{
	id: number;
	status: MemberStatus;
}

export class MemberUpdateNotifyDto {
	domain: string;
	action: string;
	content: Member;
	static of(id: number, status: MemberStatus){
		const dto = new MemberUpdateNotifyDto();
		dto.domain = 'member';
		dto.action = 'update';
		dto.content = {id, status};
		return dto;
	}
}