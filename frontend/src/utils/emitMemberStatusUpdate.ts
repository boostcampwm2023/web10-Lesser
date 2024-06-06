import { Socket } from "socket.io-client";
import { LandingMemberDTO } from "../types/DTO/landingDTO";

const emitMemberStatusUpdate = (socket: Socket, content: LandingMemberDTO) => {
  socket.emit("member", {
    action: "update",
    content,
  });
};

export default emitMemberStatusUpdate;
