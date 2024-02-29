import { useEffect, useRef, useState } from "react";

const TypingTextComponent = ({
  text,
  frame,
  setAnimeFinished,
  animeFinishFlag,
  flag = true,
}: {
  text: string;
  frame: number;
  setAnimeFinished: () => void;
  animeFinishFlag: boolean;
  flag?: boolean;
}) => {
  const [typingText, setTypingText] = useState<string>("");
  const textIndex = useRef<number>(0);
  const lastTimeStamp = useRef<number | null>(null);

  const animationCallback = (timeStamp: number) => {
    if (lastTimeStamp.current === null) {
      lastTimeStamp.current = timeStamp;
    }

    const elapsedTime = timeStamp - lastTimeStamp.current;

    if (elapsedTime >= frame) {
      lastTimeStamp.current = timeStamp;

      setTypingText(() => {
        const newState = text.slice(0, textIndex.current) + "⏐";
        textIndex.current += 1;
        return newState;
      });
    }

    if (textIndex.current >= text.length + 1) {
      setAnimeFinished();
      return;
    }
    requestAnimationFrame(animationCallback);
  };

  useEffect(() => {
    let animeId: number;
    if (animeFinishFlag) {
      setTypingText(text);
    } else if (flag) {
      animeId = requestAnimationFrame(animationCallback);
    }

    return () => {
      cancelAnimationFrame(animeId);
    };
  }, [flag]);
  return <p>{typingText}</p>;
};

const useTypingAnime = (text: string, frame: number, flag?: boolean) => {
  const [animeFinishFlag, setAnimeFinishFlag] = useState<boolean>(false);
  const setAnimeFinished = () => {
    setAnimeFinishFlag(true);
  };

  const TypingTextDiv = () => {
    return TypingTextComponent({ text, frame, setAnimeFinished, animeFinishFlag, flag });
  };

  return { animeFinishFlag, TypingTextDiv };
};

export default useTypingAnime;
