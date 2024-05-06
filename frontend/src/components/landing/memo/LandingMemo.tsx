import { useEffect, useRef, useState } from "react";
import MemoEditor from "./MemoEditor";
import { LandingMemoDTO } from "../../../types/DTO/landingDTO";

const LandingMemoBlock = ({ author }: LandingMemoDTO) => {
  const [editorOpened, setEditorOpened] = useState<Boolean>(false);
  const memoRef = useRef<HTMLDivElement>(null);

  const openEditor = () => setEditorOpened(true);
  const closeEditor = () => setEditorOpened(false);

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (memoRef.current && !memoRef.current.contains(target as Node)) {
        closeEditor();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="w-[13.75rem] h-[9.375rem] flex flex-col px-4 py-3 gap-2 bg-[#FFD966]"
      ref={memoRef}
      onClick={openEditor}
    >
      <input
        placeholder="제목을 작성하세요"
        className="text-xs font-bold bg-transparent focus:outline-none"
      />
      <textarea
        placeholder="내용을 작성하세요"
        className="text-xxs bg-transparent focus:outline-none h-full resize-none scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-dark-gray scrollbar-track-transparent"
        spellCheck="false"
      />
      <div className="flex justify-between items-center">
        <p className="text-xxxs h-5 font-bold">{author}</p>
        {editorOpened && <MemoEditor />}
      </div>
    </div>
  );
};

export default LandingMemoBlock;
