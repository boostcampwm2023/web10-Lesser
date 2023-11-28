import { IconProps } from '../../types/icon';

const CheckIcon = ({ color = 'text-black', backgroundColor = 'bg-transparent' }: IconProps) => (
  <svg
    className={`${color} ${backgroundColor}`}
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 6.5L8.625 18.5L3 13.0455" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CheckIcon;
