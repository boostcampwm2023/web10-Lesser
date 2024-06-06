import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { USER_STATUS_WORD, USER_WORD_STATUS } from "../../../constants/landing";
import UserBlock from "./UserBlock";
import useDropdown from "../../../hooks/common/dropdown/useDropdown";
import { LandingMemberDTO } from "../../../types/DTO/landingDTO";
import useUpdateUserStatus from "../../../hooks/common/member/useUpdateUserStatus";
import { DEFAULT_MEMBER } from "../../../constants/projects";
import { memberResponse } from "../../../types/DTO/authDTO";

interface LandingMemberProps {
  projectTitle: string;
}

interface useOutletContextValues {
  socket: Socket;
  addUserStatusEventListener: () => void;
  removeUserStatusEventListener: () => void;
  handleCanAddStatusEventListener: (havePurpose: boolean) => void;
}

const LandingMember = ({ projectTitle }: LandingMemberProps) => {
  const {
    socket,
    addUserStatusEventListener,
    removeUserStatusEventListener,
    handleCanAddStatusEventListener,
  }: useOutletContextValues = useOutletContext();
  const { Dropdown, selectedOption, handleChangeSelectedOption } = useDropdown({
    placeholder: "내 상태",
    options: ["접속 중", "부재 중", "자리비움"],
    defaultOption: "접속 중",
  });
  const { myInfo, memberList, inviteLinkIdRef, emitMemberStatusUpdate } =
    useUpdateUserStatus(socket, handleChangeSelectedOption);

  const userData: memberResponse = JSON.parse(
    window.localStorage.getItem("member") ?? DEFAULT_MEMBER
  );
  const { imageUrl, username } = myInfo.imageUrl ? myInfo : userData;

  const handleInviteButtonClick = () => {
    window.navigator.clipboard
      .writeText(
        `${window.location.origin}/projects/invite/${projectTitle.replace(
          /\s/g,
          ""
        )}/${inviteLinkIdRef.current}`
      )
      .then(() => {
        alert("초대링크가 복사되었습니다.");
      });
  };

  function selectStatusOption(option: string) {
    emitMemberStatusUpdate({
      ...myInfo,
      status: USER_WORD_STATUS[option],
    });

    if (option === USER_STATUS_WORD.away || option === USER_STATUS_WORD.off) {
      handleCanAddStatusEventListener(false);
      removeUserStatusEventListener();
    } else {
      handleCanAddStatusEventListener(true);
      addUserStatusEventListener();
    }
  }

  return (
    <div className="w-full px-6 py-6 overflow-y-scroll rounded-lg shadow-box bg-gradient-to-tr to-light-green-linear-from from-light-green scrollbar-thin scrollbar-thumb-light-green scrollbar-track-transparent scrollbar-thumb-rounded-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-xs font-bold text-white">| 내 상태</p>
          <div className="h-fit" />
          <Dropdown
            buttonClassName="flex justify-between items-center w-[6rem] h-6 pl-5 text-white text-xxxs bg-middle-green pr-3 rounded-md"
            containerClassName="w-[6rem] bg-white rounded-b-lg overflow-hidden"
            itemClassName="w-full text-xxxs text-center font-semibold py-2 hover:bg-middle-green hover:text-white hover:font-semibold"
            iconSize="w-[12px] h-[12px]"
            selectOption={selectStatusOption}
          />
        </div>
        <UserBlock
          imageUrl={imageUrl}
          username={username}
          status={USER_WORD_STATUS[selectedOption]}
        />
        <div className="flex justify-between text-white">
          <p className="text-xs font-bold">| 함께하는 사람들</p>
          <button
            className="text-xxs hover:underline"
            onClick={handleInviteButtonClick}
          >
            초대링크 복사
          </button>
        </div>
        {memberList.map((memberData: LandingMemberDTO) => (
          <UserBlock {...memberData} key={memberData.id} />
        ))}
      </div>
    </div>
  );
};

export default LandingMember;
