import { IconProps } from '../../types/icon';

const EditIcon = ({ color = 'text-black', backgroundColor = 'bg-transparent', size }: IconProps) => (
  <svg
    className={`${color} ${backgroundColor}`}
    width={size}
    height={size}
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_310_3646)">
      <path
        d="M3 17.7501V21.5001H6.75L17.81 10.4401L14.06 6.69006L3 17.7501ZM20.71 7.54006C21.1 7.15006 21.1 6.52006 20.71 6.13006L18.37 3.79006C17.98 3.40006 17.35 3.40006 16.96 3.79006L15.13 5.62006L18.88 9.37006L20.71 7.54006Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_310_3646">
        <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default EditIcon;
