import { useState } from "react";
import { LandingDTO } from "../../types/DTO/landingDTO";
import { useParams } from "react-router-dom";
import LandingProject from "../../components/landing/LandingProject";
import { LANDING_SPRINT_BAR } from "../../constants/landing";
import formatDate from "../../utils/formatDate";

const sampleData: LandingDTO = {
  project: {
    title: "프로젝트 이름",
    subject: "프로젝트 주제가 여기에 이쁘게 쓰여질 예정입니다.",
    createdAt: "2024-03-14T12:00:00Z", // 날짜는 ISOstring 형식
  },
  member: [
    { username: "", imageUrl: "", status: "on" },
    { username: "", imageUrl: "", status: "off" },
    { username: "", imageUrl: "", status: "away" },
  ], // 내 정보는 포함 x, 멤버 없는 경우 빈 배열 []
  sprint: {
    title: "string",
    startDate: "2024-03-14T12:00:00Z",
    endDate: "2024-04-21T12:00:00Z",
    totalTask: 120,
    completedTask: 10,
    myTotalTask: 30,
    myCompletedTask: 13,
  }, // 진행중인 스프린트가 없는 경우 null
  // sprint: null,
  board: [
    { id: 0, head: "메모 제목", body: "메모 내용", author: "작성자" },
    { id: 1, head: "메모 제목", body: "메모 내용", author: "작성자" },
  ], // 메모가 없는 경우 빈 배열 []
  link: [
    { id: 0, description: "디자인 피그마", url: "https://..." },
    { id: 1, description: "디자인 피그마", url: "https://..." },
  ], // 외부 링크가 없는 경우 빈 배열 []
};

interface LandingSprintBarProps {
  start: string;
  end: string;
  dataNum: number;
  percent: number;
  type: "SPRINT" | "TOTAL" | "PERSONAL";
}

// unit 테스트 하기!
const diffBetweenDate = (start: string, end: string) => {
  const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const LandingSprintBar = ({ start, end, dataNum, percent, type }: LandingSprintBarProps) => {
  const { color, text, bgColor, display } = LANDING_SPRINT_BAR[type];
  return (
    <div className={`flex flex-col ${color}`}>
      <p className="text-base font-bold">{text}</p>
      <div className="flex justify-between">
        <p className="text-m font-bold">{display(dataNum)}</p>
        <div className="w-[13.125rem] flex flex-col">
          <div className="flex justify-between text-black text-base font-bold">
            <p>{start}</p>
            <p>{end}</p>
          </div>
          <div className="w-full h-3 flex bg-light-gray rounded-full">
            <div
              className={`${bgColor} rounded-full`}
              style={{ width: percent <= 1 ? 210 * percent : 210 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [landingData] = useState<LandingDTO>(sampleData);
  const { projectId } = useParams();
  if (!projectId) throw Error("Invalid Web URL");
  const { project, sprint } = landingData;
  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="h-[17.6875rem] w-full shrink-0 flex gap-9">
        <LandingProject {...{ project, projectId }} />
        <div className="w-full shadow-box rounded-lg"></div>
      </div>
      <div className="h-[20.5625rem] w-full shrink-0 flex gap-9">
        <div className="w-full shadow-box rounded-lg p-6 flex flex-col justify-between">
          <p className="text-l text-middle-green font-bold">| 스프린트 정보</p>
          {sprint ? (
            <>
              <LandingSprintBar
                start={formatDate(sprint.startDate).slice(2)}
                end={formatDate(sprint.endDate).slice(2)}
                dataNum={diffBetweenDate(sprint.endDate, sprint.startDate)}
                percent={Number(
                  (
                    diffBetweenDate(new Date().toISOString(), sprint.startDate) /
                    diffBetweenDate(sprint.endDate, sprint.startDate)
                  ).toFixed(2)
                )}
                type="SPRINT"
              />
              <LandingSprintBar
                start={`${sprint.completedTask} Task`}
                end={`${sprint.totalTask} Task`}
                dataNum={Number((sprint.completedTask / sprint.totalTask).toFixed(2)) * 100}
                percent={Number((sprint.completedTask / sprint.totalTask).toFixed(2))}
                type="TOTAL"
              />
              <LandingSprintBar
                start={`${sprint.myCompletedTask} Task`}
                end={`${sprint.myTotalTask} Task`}
                dataNum={Number((sprint.myCompletedTask / sprint.myTotalTask).toFixed(2)) * 100}
                percent={Number((sprint.myCompletedTask / sprint.myTotalTask).toFixed(2))}
                type="PERSONAL"
              />
            </>
          ) : (
            <div className="h-full flex justify-center items-center">스프린트 정보가 없습니다</div>
          )}
        </div>
        <div className="w-full shadow-box rounded-lg"></div>
        <div className="w-full shadow-box rounded-lg"></div>
      </div>
    </div>
  );
};

export default LandingPage;
