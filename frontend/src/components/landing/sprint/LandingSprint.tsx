import { useEffect, useState } from "react";
import { LandingDTO, LandingSprintDTO } from "../../../types/DTO/landingDTO";
import diffBetweenDate from "../../../utils/diffBetweenDate";
import formatDate from "../../../utils/formatDate";
import LandingSprintBar from "./LandingSprintBar";
import {
  LandingSocketData,
  LandingSocketDomain,
} from "../../../types/common/landing";
import { Socket } from "socket.io-client";
import { useOutletContext } from "react-router-dom";

const LandingSprint = () => {
  const { socket }: { socket: Socket } = useOutletContext();
  const [sprint, setSprint] = useState<LandingSprintDTO | null>(null);
  const handleInitEvent = (content: LandingDTO) => {
    const { sprint } = content as LandingDTO;
    setSprint(sprint);
  };
  const handleOnLanding = ({ domain, content }: LandingSocketData) => {
    if (domain !== LandingSocketDomain.INIT) return;
    handleInitEvent(content);
  };
  useEffect(() => {
    socket.on("landing", handleOnLanding);

    return () => {
      socket.off("landing");
    };
  });

  return (
    <div className="w-full shadow-box rounded-lg p-6 flex flex-col justify-between">
      <p className="text-l text-middle-green font-bold">| 스프린트 정보</p>
      {sprint ? (
        <>
          <LandingSprintBar
            start={formatDate(sprint.startDate).slice(2)}
            end={formatDate(sprint.endDate).slice(2)}
            displayNum={diffBetweenDate(
              sprint.endDate,
              new Date().toISOString()
            )}
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
            displayNum={Math.ceil(
              (100 * sprint.completedTask) / sprint.totalTask
            )}
            percent={Number(
              (sprint.completedTask / sprint.totalTask).toFixed(2)
            )}
            type="TOTAL"
          />
          <LandingSprintBar
            start={`${sprint.myCompletedTask} Task`}
            end={`${sprint.myTotalTask} Task`}
            displayNum={Math.ceil(
              (100 * sprint.myCompletedTask) / sprint.myTotalTask
            )}
            percent={Number(
              (sprint.myCompletedTask / sprint.myTotalTask).toFixed(2)
            )}
            type="PERSONAL"
          />
        </>
      ) : (
        <div className="h-full flex justify-center items-center">
          스프린트 정보가 없습니다
        </div>
      )}
    </div>
  );
};

export default LandingSprint;
