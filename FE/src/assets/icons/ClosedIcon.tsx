import { IconProps } from '../../types/icon';

const ClosedIcon = ({ color = 'text-black', backgroundColor = 'bg-transparent' }: IconProps) => (
  <svg
    className={`${color} ${backgroundColor}`}
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.75735 8.25732L16.2426 16.7426" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.75735 16.7427L16.2426 8.25739" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ClosedIcon;
