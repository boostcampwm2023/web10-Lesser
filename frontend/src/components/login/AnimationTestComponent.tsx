import React from "react";
import { useTypingAnime } from ".";

const AnimationTestComponent = () => {
  const { animeFinishFlag: first, TypingTextDiv: FirstDiv } = useTypingAnime("abcdefg", 100, true);
  const { TypingTextDiv: SecondDiv } = useTypingAnime("hello world", 100, first);
  return (
    <div className="text-l font-bold">
      <FirstDiv />
      <SecondDiv />
    </div>
  );
};

export default React.memo(AnimationTestComponent);
