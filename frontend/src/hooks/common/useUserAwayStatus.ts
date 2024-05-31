import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import useLandingEmitEvent from "./socket/useLandingEmitEvent";
import useMemberStore from "../../stores/useMemberStore";

const useUserAwayStatus = (socket: Socket) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const myInfo = useMemberStore((state) => state.myInfo);
  const { memberSocketEvent } = useLandingEmitEvent(socket);
  const TIME = 1000 * 60 * 10;

  const handleUserAct = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (myInfo.status === "away") {
      memberSocketEvent.emitMemberStatusUpdate({
        ...myInfo,
        status: "on",
      });
    }

    timerRef.current = setTimeout(() => {
      memberSocketEvent.emitMemberStatusUpdate({
        ...myInfo,
        status: "away",
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }, TIME);
  };

  const addUserActEventListener = () => {
    window.addEventListener("mousemove", handleUserAct);
    window.addEventListener("keydown", handleUserAct);
    window.addEventListener("scroll", handleUserAct);
    window.addEventListener("click", handleUserAct);
  };

  const removeUserActEventListener = () => {
    window.removeEventListener("mousemove", handleUserAct);
    window.removeEventListener("keydown", handleUserAct);
    window.removeEventListener("scroll", handleUserAct);
    window.removeEventListener("click", handleUserAct);
  };

  useEffect(() => {
    addUserActEventListener();

    return () => {
      removeUserActEventListener();
    };
  }, []);

  return { addUserActEventListener, removeUserActEventListener };
};

export default useUserAwayStatus;
