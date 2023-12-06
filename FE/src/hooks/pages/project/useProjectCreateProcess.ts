import { useState } from 'react';

const useProjectCreateProcess = () => {
  const [process, setProcess] = useState<number>(0);
  const setNextProcess = () => {
    setProcess((process) => process + 1);
  };

  return { process, setNextProcess };
};

export default useProjectCreateProcess;
