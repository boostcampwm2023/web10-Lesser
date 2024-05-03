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
          className="text-xxs bg-transparent focus:outline-none h-full resize-none"
          spellCheck="false"
        />
        <p className="text-xxxs font-bold">{username}</p>
      </div>
      <div className="absolute w-[13.75rem] h-fit bg-black top-[10rem] z-10 rounded-xl flex justify-between px-4 py-3">
        <button className="w-7 h-7 rounded-full outline outline-offset-2 outline-blue-500 bg-[#FFD966]" />
        <button className="w-7 h-7 rounded-full outline outline-offset-2 outline-blue-500 bg-[#FFAFA3]" />
        <button className="w-7 h-7 rounded-full outline outline-offset-2 outline-blue-500 bg-[#80CAFF]" />
        <button className="w-7 h-7 rounded-full outline outline-offset-2 outline-blue-500 bg-[#D9D9D9]" />
        <button className="w-7 h-7 rounded-full outline outline-offset-2 outline-blue-500 bg-error-red" />
      </div>
    </div>
  );
};

export default LandingMemoBlock;
