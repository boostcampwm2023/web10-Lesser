import { useEffect } from "react";

const ErrorThrowPage = () => {
  // useEffect(() => {
  //   throw Error("임시 에러입니다!");
  // });

  return (
    <div>
      <p>Error Throwing!</p>
      <p>Error Page로 이동해야 합니다!</p>
    </div>
  );
};

export default ErrorThrowPage;
