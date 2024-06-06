import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import useLandingEmitEvent from "./socket/useLandingEmitEvent";
import useMemberStore from "../../stores/useMemberStore";
import useThrottle from "./throttle/useThrottle";

const useAwayUser = (socket: Socket) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const myInfo = useMemberStore((state) => state.myInfo);
  const updateMemberList = useMemberStore((state) => state.updateMemberList);
  const throttle = useThrottle();
  const { memberSocketEvent } = useLandingEmitEvent(socket);
  const TIME = 1000 * 60 * 10;
  const THROTTLE_TIME = 3000;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const setTimer = () => {
    timerRef.current = setTimeout(() => {
      memberSocketEvent.emitMemberStatusUpdate({
        ...myInfo,
        status: "away",
      });

      clearTimer();
    }, TIME);
  };

  const handleUserStatus = () => {
    throttle(THROTTLE_TIME, () => {
      clearTimer();

      if (myInfo.status === "away") {
        memberSocketEvent.emitMemberStatusUpdate({
          ...myInfo,
          status: "on",
        });

        setTimer();
      }

      setTimer();
    });
  };

  const addUserStatusEventListener = () => {
    window.addEventListener("mousemove", handleUserStatus);
    window.addEventListener("keydown", handleUserStatus);
    window.addEventListener("scroll", handleUserStatus);
    window.addEventListener("click", handleUserStatus);
  };

  const removeUserStatusEventListener = () => {
    window.removeEventListener("mousemove", handleUserStatus);
    window.removeEventListener("keydown", handleUserStatus);
    window.removeEventListener("scroll", handleUserStatus);
    window.removeEventListener("click", handleUserStatus);
    clearTimer();
  };

  useEffect(() => {
    addUserStatusEventListener();

    return () => {
      removeUserStatusEventListener();
    };
  }, [myInfo]);

  useEffect(
    () => () => {
      updateMemberList([]);
    },
    []
  );

  return { addUserStatusEventListener, removeUserStatusEventListener };
};

export default useAwayUser;
