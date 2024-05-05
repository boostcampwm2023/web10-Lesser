import TrashBinIcon from "../../../assets/icons/trash-can.svg?react";

interface LandingMemoBlockProps {
  username: string;
}

const LandingMemoBlock = ({ username }: LandingMemoBlockProps) => {
  return (
    <div className="relative">
      <div className="w-[13.75rem] h-[9.375rem] flex flex-col px-4 py-3 gap-2 bg-[#FFD966]">
        <input
          placeholder="제목을 작성하세요"
          className="text-xs font-bold bg-transparent focus:outline-none"
        />
        <textarea
          placeholder="내용을 작성하세요"
          className="text-xxs bg-transparent focus:outline-none h-full resize-none scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-dark-gray scrollbar-track-transparent"
          spellCheck="false"
        />
        <p className="text-xxxs font-bold">{username}</p>
      </div>
      <div className="absolute w-32 h-fit bottom-3 right-3 z-10 rounded-full flex justify-between items-center duration-100">
        <button className="w-5 h-5 rounded-full border-white border bg-[#FFD966] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
        <button className="w-5 h-5 rounded-full border-white border bg-[#FFAFA3] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
        <button className="w-5 h-5 rounded-full border-white border bg-[#80CAFF] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
        <button className="w-5 h-5 rounded-full border-white border bg-[#D9D9D9] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
        <button className="w-5 h-5 rounded-full border-white border bg-error-red flex justify-center items-center hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out">
          <TrashBinIcon width={12} height={12} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
};

export default LandingMemoBlock;
