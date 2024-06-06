import { TECH_STACK_INFO } from "../../constants/account";

interface TechStackModalProps {
  close: () => void;
  onAddTechStack: (techStack: string) => void;
}

const TechStackModal = ({ close, onAddTechStack }: TechStackModalProps) => {
  const handleTechStackClick = (techStack: string) => {
    onAddTechStack(techStack);
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
