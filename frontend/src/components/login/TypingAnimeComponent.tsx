import React from "react";
import { useTypingAnime } from "../../hooks";

const TypingAnimeComponent = () => {
  const { animeFinishFlag: firstFlag, TypingTextDiv: FirstComponent } = useTypingAnime(
    "프로젝트를 관리하는 방법,",
    50
  );
  const { animeFinishFlag: secondFlag, TypingTextDiv: SecondComponent } = useTypingAnime(
    "애자일 하게 일하는 방법,",
    50,
    firstFlag
  );
  const { animeFinishFlag: thirdFlag, TypingTextDiv: ThirdComponent } = useTypingAnime(
    "어려울 필요가 있을까요?",
    50,
    secondFlag
  );
  const { TypingTextDiv: FourthComponent } = useTypingAnime(
    "프로젝트 관리를 더욱 쉽고 애자일하게",
    50,
    thirdFlag
  );
  return (
    <div className="flex flex-col text-m font-semibold space-y-6 text-dark-gray min-h-[252px]">
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent />
      <FourthComponent />
    </div>
  );
};

export default React.memo(TypingAnimeComponent);
