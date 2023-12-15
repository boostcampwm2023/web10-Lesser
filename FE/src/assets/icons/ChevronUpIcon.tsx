import { IconProps } from '../../types/icon';

const ChevronUpIcon = ({ color = 'text-black', backgroundColor = 'bg-transparent', size = 24 }: IconProps) => (
  <svg
    className={`${color} ${backgroundColor}`}
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 15.5L12 9.5L18 15.5" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ChevronUpIcon;
