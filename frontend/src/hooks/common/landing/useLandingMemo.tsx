import { useEffect, useRef, useState } from "react";
import { MemoColorString } from "../../../types/common/landing";

const useLandingMemo = (
  title: string,
  content: string,
  color: MemoColorString
) => {
  const [editorOpened, setEditorOpened] = useState<Boolean>(false);
  const [memoTitle, setMemoTitle] = useState<string>(title);
  const [memoContent, setMemoContent] = useState<string>(content);
  const [memoColor, setMemoColor] = useState<MemoColorString>(color);
  const memoRef = useRef<HTMLDivElement>(null);

  const openEditor = () => setEditorOpened(true);
  const closeEditor = () => setEditorOpened(false);

  const changeMemoColor = (color: MemoColorString) => {
    setMemoColor(color);
  };

  const handleTitleChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setMemoTitle(target.value);
  };

  const handleContentChange = ({
    target,
  }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemoContent(target.value);
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

  return {
    editorOpened,
    memoTitle,
    memoContent,
    memoColor,
    memoRef,
    openEditor,
    changeMemoColor,
    handleContentChange,
    handleTitleChange,
  };
};

export default useLandingMemo;
