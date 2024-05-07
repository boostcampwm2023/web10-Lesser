import LandingTitleUI from "../common/LandingTitleUI";
import MemoBlock from "./MemoBlock";

const LandingMemoList = () => {
  return (
    <div className="w-full rounded-lg shadow-box bg-gradient-to-tr from-dark-green-linear-from to-dark-green-linear-to">
      <div className="py-6 ps-6 pe-3 w-[32rem]">
        <LandingTitleUI
          title={"프로젝트 메모"}
          handleClick={() => {
            console.log("hello");
          }}
        />
        <div className="mt-6 flex flex-wrap w-full h-[11rem] gap-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-dark-green scrollbar-track-transparent scrollbar-thumb-rounded-full">
          <MemoBlock
            author={"김용현"}
            id={1}
            title={""}
            content={"world"}
            createdAt="2024-03-14T12:00:00Z"
            color="yellow"
          />
          <MemoBlock
            author={"김용현"}
            id={2}
            title={"hello"}
            content={"world"}
            createdAt="2024-03-14T12:00:00Z"
            color="gray"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingMemoList;
