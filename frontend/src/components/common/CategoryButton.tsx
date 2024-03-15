import closed from "../../assets/icons/closed.svg";

interface CategoryButtonProps {
  category: string;
  onCloseButtonClick: (category: string) => void;
}

const CategoryButton = ({
  category,
  onCloseButtonClick,
}: CategoryButtonProps) => (
  <div className="min-w-[12.25rem] min-h-[3.25rem] bg-light-green rounded-xl text-white text-2xl font-bold flex items-center py-2 pl-9 pr-3 shadow-box">
    {category}
    <button
      type="button"
      onClick={() => onCloseButtonClick(category)}
      className="ml-auto"
    >
      <img src={closed} alt="close" />
    </button>
  </div>
);

export default CategoryButton;
