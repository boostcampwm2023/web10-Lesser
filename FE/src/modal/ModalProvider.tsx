import React from "react";
import { ReactElement, ReactNode, createContext, useCallback, useMemo, useState } from "react";

interface ModalProviderProps {
  children: ReactElement;
}

export const ModalContext = createContext<{
  mount(id: string, element: ReactNode): void;
  unmount(id: string): void;
} | null>(null);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalMapById, setModalMapById] = useState<Map<string, ReactNode>>(new Map());

  const mount = useCallback((id: string, element: ReactNode) => {
    setModalMapById((modalMapById) => {
      const cloned = new Map(modalMapById);
      cloned.set(id, element);
      return cloned;
    });
  }, []);

  const unmount = useCallback((id: string) => {
    setModalMapById((modalMapById) => {
      const cloned = new Map(modalMapById);
      cloned.delete(id);
      return cloned;
    });
  }, []);

  const context = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <ModalContext.Provider value={context}>
      <div className="relative">
        {children}
        {[...modalMapById.entries()].map(([id, element]) => (
          <React.Fragment key={id}>{element}</React.Fragment>
        ))}
      </div>
    </ModalContext.Provider>
  );
};
