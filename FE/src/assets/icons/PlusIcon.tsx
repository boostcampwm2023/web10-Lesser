import { IconProps } from '../../types/icon';

const PlusIcon = ({ color = 'text-black', backgroundColor = 'bg-transparent' }: IconProps) => (
  <svg
    className={`${color} ${backgroundColor}`}
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 12.5H18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 18.5V6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default PlusIcon;
