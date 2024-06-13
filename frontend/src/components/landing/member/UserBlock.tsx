import { USER_STATE_DISPLAY } from "../../../constants/landing";
import ProfileImage from "../../common/ProfileImage";

interface UserBlockProps {
  imageUrl: string;
  username: string;
  status: "on" | "off" | "away";
}

const UserStateDisplay = ({
  status = "off",
}: {
  status: "on" | "off" | "away";
}) => {
  const { bgColor, text } = USER_STATE_DISPLAY[status];
  return (
    <div className="flex gap-2 items-center w-[4.0625rem]">
      <div className={`w-3 h-3 rounded-full ${bgColor}`} />
      <p className="font-semibold text-xxxs">{text}</p>
    </div>
  );
};

const UserBlock = ({ imageUrl, username, status }: UserBlockProps) => (
  <div className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-box">
    <ProfileImage imageUrl={imageUrl} pxSize={40} />
    <p className="text-xs font-bold text-middle-green">{username}</p>
    <UserStateDisplay status={status} />
  </div>
);

export default UserBlock;
