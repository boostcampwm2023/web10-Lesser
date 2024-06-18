import { LandingMemberDTO, MemberStatus } from "../types/DTO/landingDTO";

const getStatusOrder = (status: MemberStatus) => {
  if (status === "on") {
    return 2;
  }

  if (status === "away") {
    return 1;
  }

  return 0;
};

const sortMemberByStatus = (
  member1: LandingMemberDTO,
  member2: LandingMemberDTO
) => {
  const member1Status = getStatusOrder(member1.status);
  const member2Status = getStatusOrder(member2.status);
  if (member1Status > member2Status) {
    return -1;
  }

  if (member1Status < member2Status) {
    return 1;
  }

  return 0;
};

export default sortMemberByStatus;
