import useMemberStore from "../../stores/useMemberStore";
import { SettingJoinRequestDTO } from "../../types/DTO/settingDTO";

interface JoinRequestBlockProps extends SettingJoinRequestDTO {}

const JoinRequestBlock = ({ username, imageUrl }: JoinRequestBlockProps) => {
  const myRole = useMemberStore((state) => state.myInfo.role);

  return (
    <div className="flex w-full gap-3">
      <div className="w-[16.25rem] flex gap-3 items-center">
        <img className="w-8 h-8 rounded-full" src={imageUrl} alt={username} />
        <p className="">{username}</p>
      </div>
      <div className="w-[18.75rem]"></div>
      <div className="w-[30rem]">
        {myRole === "LEADER" && (
          <button
            className="px-2 py-1 text-white rounded w-fit bg-error-red text-xxs"
            type="button"
          >
            프로젝트에서 제거
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinRequestBlock;
