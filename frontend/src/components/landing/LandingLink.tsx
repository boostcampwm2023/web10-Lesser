import { useModal } from "../../hooks/common/modal/useModal";
import { LandingLinkDTO } from "../../types/DTO/landingDTO";
import LandingLinkBlock from "./LandingLinkBlock";
import Plus from "../../assets/icons/plus.svg?react";
import LandingLinkModal from "./LandingLinkModal";

const LandingLink = ({ link }: { link: LandingLinkDTO[] }) => {
  const { open, close } = useModal(true);
  const handleCreateLinkClick = () => {
    open(<LandingLinkModal close={close} />);
  };

  return (
    <div className="w-full shadow-box rounded-lg flex flex-col pt-6 pl-6 pr-3 bg-gradient-to-tr to-middle-green-linear-from from-middle-green">
      <div className="flex justify-between items-center pr-3">
        <p className="text-white text-m font-bold">| 외부 링크</p>
        <button
          onClick={handleCreateLinkClick}
          className="hover:bg-dark-green rounded-md"
        >
          <Plus width={24} height={24} stroke="#FFFFFF " />
        </button>
      </div>
      <div className="flex flex-col gap-3 pr-6 py-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-dark-green scrollbar-track-transparent">
        {link.map((linkData: LandingLinkDTO) => {
          return <LandingLinkBlock {...linkData} key={linkData.id} />;
        })}
      </div>
    </div>
  );
};

export default LandingLink;
