import { useEffect, useRef, useState } from "react";
import MemoEditor from "./MemoEditor";
import { LandingMemoDTO } from "../../../types/DTO/landingDTO";
import { MemoColor, MemoColorString } from "../../../types/common/landing";

const LandingMemoBlock = ({
  title,
  content,
  author,
  color,
}: LandingMemoDTO) => {
  const [editorOpened, setEditorOpened] = useState<Boolean>(false);
  const [memoTitle] = useState<string>(title);
  const [memoContent] = useState<string>(content);
  const [memoColor, setMemoColor] = useState<MemoColorString>(color);
  const memoRef = useRef<HTMLDivElement>(null);

  const colorStyle = MemoColor[memoColor];
  const openEditor = () => setEditorOpened(true);
  const closeEditor = () => setEditorOpened(false);
  const changeMemoColor = (color: MemoColorString) => {
    setMemoColor(color);
  };

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
      className={`w-[13.75rem] h-[9.375rem] flex flex-col px-4 py-3 gap-2 ${colorStyle}`}
      ref={memoRef}
      onClick={openEditor}
    >
      <input
        placeholder="제목을 작성하세요"
        className="text-xs font-bold bg-transparent focus:outline-none"
        value={memoTitle}
      />
      <textarea
        placeholder="내용을 작성하세요"
        className="text-xxs bg-transparent focus:outline-none h-full resize-none scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-dark-gray scrollbar-track-transparent"
        spellCheck="false"
        value={memoContent}
      />
      <div className="flex justify-between items-center">
        <p className="text-xxxs h-5 font-bold">{author}</p>
        {editorOpened && (
          <MemoEditor color={memoColor} changeMemoColor={changeMemoColor} />
        )}
      </div>
    </div>
  );
};

export default LandingMemoBlock;
