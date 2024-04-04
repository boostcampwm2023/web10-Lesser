import { useState } from "react";
import { LandingDTO } from "../../types/DTO/landingDTO";
import { useParams } from "react-router-dom";
import LandingProject from "../../components/landing/LandingProject";
import LandingSprint from "../../components/landing/LandingSprint";

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
    endDate: "2024-04-05T12:00:00Z",
    totalTask: 120,
    completedTask: 120,
    myTotalTask: 30,
    myCompletedTask: 30,
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
        <LandingSprint {...{ sprint }} />
        <div className="w-full shadow-box rounded-lg bg-gradient-to-tr to-light-green-linear-from from-light-green pt-6 pl-6 pr-3 overflow-y-scroll scrollbar-thin scrollbar-thumb-light-green scrollbar-track-transparent">
          <div className="h-[100px] shrink-0 shadow-box"></div>
          <div className="h-[100px] shrink-0 shadow-box"></div>
          <div className="h-[100px] shrink-0 shadow-box"></div>
          <div className="h-[100px] shrink-0 shadow-box"></div>
          <div className="h-[100px] shrink-0 shadow-box"></div>
        </div>
        <div className="w-full shadow-box rounded-lg"></div>
      </div>
    </div>
  );
};

export default LandingPage;
