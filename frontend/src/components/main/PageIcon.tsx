import { SVGReactElement } from "../../types/common";
import { Link } from "react-router-dom";
import ChevronRightIcon from "../../assets/icons/chevron-right.svg?react";

interface PageIconProps {
  Icon: SVGReactElement;
  activated: boolean;
  to: string;
  pageName: string;
}

const PageIcon = ({ Icon, activated, to, pageName }: PageIconProps): JSX.Element => {
  if (activated) {
    return (
      <div className="flex justify-between items-center pl-2 pr-[0.3125rem] py-[0.3125rem] rounded-full cursor-pointer bg-white text-middle-green transition-all w-fit hover:min-w-40 hover:shadow-box hover:gap-2 group">
        <Icon width={24} height={24} fill="#3A5624" className="shrink-0" />
        <p className="text-base font-bold shrink-0 select-none hidden group-hover:inline-flex">
          {pageName}
        </p>
        <ChevronRightIcon width={18} height={18} stroke="#3A5624" className="shrink-0" />
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="group flex justify-center items-center w-[3.4375rem] text-white py-[0.3125rem] transition-all rounded-full cursor-pointer hover:min-w-40 hover:shadow-box hover:gap-2 hover:bg-white hover:text-middle-green hover:pl-2 hover:pr-[0.3125rem] hover:justify-between"
    >
      <Icon
        width={24}
        height={24}
        fill="#FFFFFF"
        className="shrink-0 group-hover:fill-middle-green"
      />
      <p className="text-base font-bold shrink-0 select-none hidden group-hover:inline-flex">
        {pageName}
      </p>
      <ChevronRightIcon
        width={18}
        height={18}
        stroke="#3A5624"
        className="shrink-0 hidden group-hover:inline-flex"
      />
    </Link>
  );
};

export default PageIcon;
