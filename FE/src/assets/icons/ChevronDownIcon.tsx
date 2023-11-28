import { IconProps } from '../../types/icon';

const ChevronDownIcon = ({ color = 'text-black', backgroundColor = 'bg-transparent' }: IconProps) => (
  <svg
    className={`${color} ${backgroundColor}`}
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 9.5L12 15.5L6 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ChevronDownIcon;
