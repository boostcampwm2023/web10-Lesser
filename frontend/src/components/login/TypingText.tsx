import { useEffect, useRef, useState } from "react";

const TypingText = ({
  text,
  frame,
  startTime = 0,
}: {
  text: string;
  frame: number;
  startTime?: number;
}) => {
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
  const delayingAnimationCallback = (timeStamp: number) => {
    if (lastTimeStamp.current === null) {
      lastTimeStamp.current = timeStamp;
    }

    const elapsedTime = timeStamp - lastTimeStamp.current;

    if (elapsedTime >= startTime) {
      lastTimeStamp.current = null;
      requestAnimationFrame(animationCallback);
    } else {
      requestAnimationFrame(delayingAnimationCallback);
    }
  };

  useEffect(() => {
    let animeId = requestAnimationFrame(delayingAnimationCallback);

    return () => {
      cancelAnimationFrame(animeId);
    };
  }, [text]);
  return <p>{typingText}</p>;
};

export default TypingText;
