interface LandingMemoBlockProps {
  username: string;
}

const LandingMemoBlock = ({ username }: LandingMemoBlockProps) => {
  return (
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
  );
};

export default LandingMemoBlock;
