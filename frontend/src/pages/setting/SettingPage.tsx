import InformationSettingSection from "../../components/setting/InformationSettingSection";

const SettingPage = () => (
  <div className="w-full h-full">
    <InformationSettingSection title="프로젝트 이름" subject="프로젝트 주제" />
    <div className="">
      <p className="font-bold text-m text-middle-green">멤버 관리</p>
    </div>
    <div className="flex flex-col gap-2 h-[18.52rem]">
      <div className="flex w-full gap-3 border-b-[2px] text-[1rem] text-dark-gray">
        <p className="w-[16.25rem]">닉네임</p>
        <p className="w-[18.75rem]">역할</p>
        <p className="w-[30rem]">작업</p>
      </div>
      <div className="flex w-full gap-3 overflow-y-auto">
        <div className="w-[16.25rem] flex gap-3 items-center">
          {/* <img className="w-8 h-8 rounded-full" src="" alt="" /> */}
          <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
          <p className="">lesserTest</p>
        </div>
        <div className="w-[18.75rem]">
          <p className="">멤버</p>
        </div>
        <div className="w-[30rem]">
          <button
            className="px-2 py-1 text-white rounded w-fit bg-error-red text-xxs"
            type="button"
          >
            프로젝트에서 제거
          </button>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="">
        <p className="text-xs">프로젝트 삭제</p>
        <p className="text-xxs">프로젝트를 삭제한 후 되돌릴 수 없습니다.</p>
      </div>
      <button
        className="h-10 px-2 font-light text-white rounded-lg w-fit bg-error-red text-xxs"
        type="button"
      >
        프로젝트 삭제
      </button>
    </div>
  </div>
);

export default SettingPage;
