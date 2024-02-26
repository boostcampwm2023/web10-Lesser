import { useEffect, useRef, useState } from "react";

const TypingText = ({ text, frame }: { text: string; frame: number }) => {
  const [typingText, setTypingText] = useState<string>("");
  const textIndex = useRef<number>(0);
  const lastTimeStamp = useRef<number | null>(null);
  const animationCallback = (timeStamp: number) => {
    if (lastTimeStamp.current === null) {
      lastTimeStamp.current = timeStamp;
    }

    const elapsedTime = timeStamp - lastTimeStamp.current;

    if (elapsedTime > frame) {
      lastTimeStamp.current = timeStamp;
      setTypingText((state) => {
        const newState = state + text[textIndex.current];
        textIndex.current += 1;
        return newState;
      });
    }

    if (textIndex.current >= text.length - 1) return;
    requestAnimationFrame(animationCallback);
  };

  useEffect(() => {
    let animeId = requestAnimationFrame(animationCallback);

    return () => {
      cancelAnimationFrame(animeId);
    };
  }, [text]);
  return <p>{typingText}</p>;
};

export default TypingText;
