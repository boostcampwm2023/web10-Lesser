import { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { ModalContext } from "./ModalProvider";

let elementId = 0;

export const useModal = () => {
  const [id] = useState(() => String(elementId++));

  const context = useContext(ModalContext);

  if (context == null) {
    throw new Error("모달을 사용하기 위해선 ModalProvider 내에 컴포넌트가 존재해야 합니다.");
  }

  const { mount, unmount } = context;

  useEffect(() => {
    return () => {
      unmount(id);
    };
  }, [id, unmount]);

  return useMemo(
    () => ({
      open: (ModalElement: ReactNode) => {
        mount(id, ModalElement);
      },
      close: () => {
        unmount(id);
      },
    }),
    [id, mount, unmount]
  );
};
