import { useEffect, useRef, useState } from "react";

const useLandingMemo = () => {
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

  return {
    editorOpened,
    memoRef,
    openEditor,
  };
};

export default useLandingMemo;
