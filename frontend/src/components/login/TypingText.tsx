import { useEffect, useRef, useState } from "react";

const TypingText = ({ text, frame }: { text: string; frame: number }) => {
  const [typingText, setTypingText] = useState<string>("");
  const textIndex = useRef<number>(0);
  // useEffect(() => {
  //   let timer = setInterval(() => {
  //     setTypingText((state) => {
  //       // console.log("setInterval 실행!");
  //       if (text.length <= textIndex.current) return state;
  //       const newState = state + text[textIndex.current];
  //       textIndex.current += 1;
  //       return newState;
  //     });
  //   }, frame);
  //   return () => clearInterval(timer);
  // }, [text]);

  const animationCallback = () => {
    setTypingText((state) => {
      const newState = state + text[textIndex.current];
      textIndex.current += 1;
      return newState;
    });

    if (textIndex.current >= text.length) return;
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
