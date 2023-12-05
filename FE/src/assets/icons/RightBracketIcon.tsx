import { IconProps } from '../../types/icon';

const RightBracketIcon = ({ color = '#006241' }: IconProps) => (
  <svg width="21" height="28" viewBox="0 0 21 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 2L10.5 14L1.5 26" stroke={color} stroke-width="2" stroke-linecap="square" stroke-linejoin="round" />
    <path d="M10.5 2L19.5 14L10.5 26" stroke={color} stroke-width="2" stroke-linecap="square" stroke-linejoin="round" />
  </svg>
);

export default RightBracketIcon;
