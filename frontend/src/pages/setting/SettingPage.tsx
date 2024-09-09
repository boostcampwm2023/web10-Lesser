const SettingPage = () => (
  <div className="w-full h-full">
    <div className="w-full mb-7">
      <p className="font-bold text-m text-middle-green">프로젝트 설정</p>
    </div>
    <div className="flex flex-col w-full">
      <div className="flex w-full gap-6 mb-5">
        <label
          className="min-w-[6.125rem] text-xs font-semibold text-middle-green"
          htmlFor="name"
        >
          프로젝트 이름
        </label>
        <div>
          <input
            className="w-[60.8rem] mb-1 h-10 border-[2px] border-text-gray rounded-lg focus:outline-middle-green px-1 hover:cursor-pointer"
            type="text"
            id="name"
            autoComplete="off"
          />
          <p className="text-xxxs text-error-red">
            프로젝트 이름을 입력해주세요
          </p>
        </div>
      </div>
      <div className="flex gap-6 mb-5">
        <label
          className="min-w-[6.125rem] text-xs font-semibold text-middle-green"
          htmlFor="name"
        >
          프로젝트 주제
        </label>
        <div>
          <input
            className="w-[60.8rem] mb-1 h-10 border-[2px] border-text-gray rounded-lg focus:outline-middle-green px-1 hover:cursor-pointer"
            type="text"
            id="name"
            autoComplete="off"
          />
          <p className="text-xxxs text-error-red">
            프로젝트 주제를 입력해주세요
          </p>
        </div>
      </div>
      <button
        className="w-[4.5rem] h-10 bg-middle-green text-white rounded-lg text-xs self-end"
        type="button"
      >
        저장
      </button>
    </div>
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
