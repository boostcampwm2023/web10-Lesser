import { useState } from "react";
import { LandingDTO } from "../../types/DTO/landingDTO";
import formatDate from "../../utils/formatDate";
import { Link, useParams } from "react-router-dom";
import { LINK_URL } from "../../constants/path";
import { LANDING_PROJECT_LINK } from "../../constants/landing";

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
    endDate: "2024-03-21T12:00:00Z",
    totalTask: 120,
    completedTask: 10,
    myTotalTask: 30,
    myCompletedTask: 13,
  }, // 진행중인 스프린트가 없는 경우 null
  board: [
    { id: 0, head: "메모 제목", body: "메모 내용", author: "작성자" },
    { id: 1, head: "메모 제목", body: "메모 내용", author: "작성자" },
  ], // 메모가 없는 경우 빈 배열 []
  link: [
    { id: 0, description: "디자인 피그마", url: "https://..." },
    { id: 1, description: "디자인 피그마", url: "https://..." },
  ], // 외부 링크가 없는 경우 빈 배열 []
};

interface LandingProjectLinkProps {
  projectId: string;
  type: "BACKLOG" | "SPRINT" | "SETTINGS";
}

const LandingProjectLink = ({ projectId, type }: LandingProjectLinkProps) => {
  const { color, text, Icon } = LANDING_PROJECT_LINK[type];
  return (
    <Link
      to={LINK_URL.BACKLOG(projectId)}
      className={`w-[8.75rem] h-[5rem] border rounded-lg flex justify-center gap-2 items-center ${color} hover:shadow-button`}
    >
      <Icon height={36} width={36} fill="#FFFFFF" />
      <div className="flex flex-col gap-1 text-white text-[1rem] font-bold">
        <p>{text}</p>
        <p>바로가기</p>
      </div>
    </Link>
  );
};

const LandingPage = () => {
  const [landingData] = useState<LandingDTO>(sampleData);
  const { projectId } = useParams();
  if (!projectId) throw Error("Invalid Web URL");
  const { project } = landingData;
  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="h-[17.6875rem] w-full shrink-0 flex gap-9">
        <div className="border w-full p-6 flex flex-col justify-between shadow-box rounded-lg">
          <div className="flex justify-between items-baseline text-middle-green font-bold">
            <p className="text-xl">| {project.title}</p>
            <p className="text-xs">{formatDate(project.createdAt)}</p>
          </div>
          <div className="text-xs">{project.subject}</div>
          <div className="flex justify-between">
            <LandingProjectLink projectId={projectId} type="BACKLOG" />
            <LandingProjectLink projectId={projectId} type="SPRINT" />
            <LandingProjectLink projectId={projectId} type="SETTINGS" />
          </div>
        </div>
        <div className="border w-full"></div>
      </div>
      <div className="h-[20.5625rem] w-full shrink-0 flex gap-9">
        <div className="border w-full"></div>
        <div className="border w-full"></div>
        <div className="border w-full"></div>
      </div>
    </div>
  );
};

export default LandingPage;
