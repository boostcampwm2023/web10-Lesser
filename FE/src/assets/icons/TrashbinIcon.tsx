import { IconProps } from "../../types/icon";

const Trashbin = ({
  color = "text-black",
  backgroundColor = "bg-transparent",
  size,
}: IconProps) => (
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
        d="M9 3.5V4.5H4V6.5H5V19.5C5 20.0304 5.21071 20.5391 5.58579 20.9142C5.96086 21.2893 6.46957 21.5 7 21.5H17C17.5304 21.5 18.0391 21.2893 18.4142 20.9142C18.7893 20.5391 19 20.0304 19 19.5V6.5H20V4.5H15V3.5H9ZM7 6.5H17V19.5H7V6.5ZM9 8.5V17.5H11V8.5H9ZM13 8.5V17.5H15V8.5H13Z"
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

export default Trashbin;
