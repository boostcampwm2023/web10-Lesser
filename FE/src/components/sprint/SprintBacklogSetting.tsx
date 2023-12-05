import { ReadBacklogEpicResponseDto, ReadBacklogTaskResponseDto } from '../../types/backlog';

interface SprintBacklogSettingProps {
  backlog: ReadBacklogEpicResponseDto[];
  sprintBacklog: ReadBacklogTaskResponseDto[];
  setBacklog: React.Dispatch<React.SetStateAction<ReadBacklogEpicResponseDto[]>>;
  setSprintBacklog: React.Dispatch<React.SetStateAction<ReadBacklogTaskResponseDto[]>>;
}

const SprintBacklogSetting = (props: SprintBacklogSettingProps) => (
  <div>
    스프린트 백로그 세팅
    {props.backlog.map(() => (
      <div>에픽</div>
    ))}
  </div>
);

export default SprintBacklogSetting;
