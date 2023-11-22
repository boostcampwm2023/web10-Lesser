import { IconProps } from '../../types/icon';

const ChevronRightIcon = ({ color = 'text-black', backgroundColor = 'bg-transparent', size = 24 }: IconProps) => (
  <svg
    className={`${color} ${backgroundColor}`}
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 6.5L15 12.5L9 18.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ChevronRightIcon;
