import MemoEditor from "./MemoEditor";
import { LandingMemoDTO } from "../../../types/DTO/landingDTO";
import { MemoColorStyle } from "../../../types/common/landing";
import useLandingMemo from "../../../hooks/common/landing/useLandingMemo";

const MemoBlock = ({ title, content, author, color }: LandingMemoDTO) => {
  const {
    editorOpened,
    memoTitle,
    memoContent,
    memoColor,
    memoRef,
    openEditor,
    changeMemoColor,
    handleContentChange,
    handleTitleChange,
  } = useLandingMemo(title, content, color);
  const colorStyle = MemoColorStyle[memoColor];

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
        onChange={handleTitleChange}
      />
      <textarea
        placeholder="내용을 작성하세요"
        className="text-xxs bg-transparent focus:outline-none h-full resize-none scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-dark-gray scrollbar-track-transparent"
        spellCheck="false"
        value={memoContent}
        onChange={handleContentChange}
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

export default MemoBlock;
