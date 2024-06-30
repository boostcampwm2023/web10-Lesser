const TaskHeader = () => (
  <div className="flex items-center justify-between py-1 border-b text-dark-gray">
    <p className="w-12">식별자</p>
    <p className="w-[25rem]">태스크 이름</p>
    <p className="w-12">담당자</p>
    <p className="w-16">예상 시간</p>
    <p className="w-16">실제 시간</p>
    <p className="w-[6.25rem]">상태</p>
  </div>
);

export default TaskHeader;
