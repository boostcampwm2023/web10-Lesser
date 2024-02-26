import { useEffect, useRef, useState } from "react";

const TypingText = ({ text, frame }: { text: string; frame: number }) => {
  const [typingText, setTypingText] = useState<string>("");
  const textIndex = useRef<number>(0);
  useEffect(() => {
    let timer = setInterval(() => {}, frame);
    setTypingText((state) => {
      const newState = state + text[textIndex.current];
      textIndex.current += 1;
      return newState;
    });

    return () => clearInterval(timer);
  });
  return <p>{typingText}</p>;
};

export default TypingText;
