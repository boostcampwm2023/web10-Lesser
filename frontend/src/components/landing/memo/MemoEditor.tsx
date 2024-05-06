import TrashBinIcon from "../../../assets/icons/trash-can.svg?react";

const MemoEditor = () => {
  return (
    <div className="absolute w-32 h-fit bottom-3 right-3 z-10 rounded-full flex justify-between items-center duration-100">
      <button className="w-5 h-5 rounded-full border-white border bg-[#FFD966] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
      <button className="w-5 h-5 rounded-full border-white border bg-[#FFAFA3] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
      <button className="w-5 h-5 rounded-full border-white border bg-[#80CAFF] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
      <button className="w-5 h-5 rounded-full border-white border bg-[#D9D9D9] hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out" />
      <button className="w-5 h-5 rounded-full border-white border bg-error-red flex justify-center items-center hover:border-blue-500 hover:border-2 hover:scale-125 transition-all ease-in-out">
        <TrashBinIcon width={12} height={12} color="#FFFFFF" />
      </button>
    </div>
  );
};

export default MemoEditor;
