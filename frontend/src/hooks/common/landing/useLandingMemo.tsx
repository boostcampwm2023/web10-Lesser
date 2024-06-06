import { useEffect, useRef, useState } from "react";
import { MemoColorType } from "../../../types/common/landing";

const useLandingMemo = (
  title: string,
  content: string,
  color: MemoColorType
) => {
  const [editorOpened, setEditorOpened] = useState<Boolean>(false);
  const [memoTitle, setMemoTitle] = useState<string>(title);
  const [memoContent, setMemoContent] = useState<string>(content);
  const [memoColor, setMemoColor] = useState<MemoColorType>(color);
  const memoRef = useRef<HTMLDivElement>(null);

  const openEditor = () => setEditorOpened(true);
  const closeEditor = () => setEditorOpened(false);

  const changeMemoColor = (color: MemoColorType) => {
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
    changeMemoColor(color);
  }, [color]);

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
