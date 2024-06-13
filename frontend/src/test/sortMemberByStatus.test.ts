import { LandingMemberDTO } from "../types/DTO/landingDTO";
import sortMemberByStatus from "../utils/sortMemberByStatus";

describe("sortMemberByStatus test", () => {
  it("on, away, off 순 정렬 테스트", () => {
    const memberList: LandingMemberDTO[] = [
      { id: 1, username: "", imageUrl: "", status: "off" },
      { id: 2, username: "", imageUrl: "", status: "on" },
      { id: 3, username: "", imageUrl: "", status: "away" },
      { id: 4, username: "", imageUrl: "", status: "on" },
      { id: 5, username: "", imageUrl: "", status: "off" },
      { id: 6, username: "", imageUrl: "", status: "away" },
    ];

    const sortedMemberIdList = memberList
      .sort(sortMemberByStatus)
      .map(({ id }) => id);
    expect(sortedMemberIdList).toStrictEqual([2, 4, 3, 6, 1, 5]);
  });
});
