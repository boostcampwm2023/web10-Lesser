import { TECH_STACK_INFO } from "../../constants/account";

interface TechStackModalProps {
  close: () => void;
  techRef: React.MutableRefObject<null | string[]>;
  setTechStackList: React.Dispatch<React.SetStateAction<string[]>>;
}

const TechStackModal = ({
  close,
  techRef,
  setTechStackList,
}: TechStackModalProps) => {
  const handleTechStackClick = (techStack: string) => {
    setTechStackList((techStackList) => {
      if (!techRef.current) {
        const newTechStackList = [techStack];
        techRef.current = [techStack];
        return newTechStackList;
      }

      const newTechStackList = [...techStackList];
      if (techStackList.indexOf(techStack) < 0) {
        techRef.current.push(techStack);
        newTechStackList.push(techStack);
      }

      return newTechStackList;
    });

    close();
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen backdrop-blur-[1px]">
      <div className="w-[32rem] h-[28.125rem] bg-white text-2xl text-text-gray overflow-y-auto rounded-xl shadow-box">
        <ul>
          {TECH_STACK_INFO.map((techStack) => (
            <li
              key={techStack}
              onClick={() => handleTechStackClick(techStack)}
              className="py-2.5 px-9 hover:text-white hover:cursor-pointer hover:bg-middle-green"
            >
              {techStack}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TechStackModal;
