import { memoColor } from "../../entity/memo.entity";

class Memo{
	id: number;
	color: memoColor;
}

export class MemoColorUpdateNotifyDto {
	domain: string;
	action: string;
	content: Memo;
	static of(id: number, color: memoColor){
		const dto = new MemoColorUpdateNotifyDto();
		dto.domain = 'memo';
		dto.action = 'colorUpdate';
		dto.content = {id, color};
		return dto;
	}
}