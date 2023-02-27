import { useRef } from 'react';

const useConstructor = callback => {
  const hasBeenCalled = useRef(false);

  if (hasBeenCalled.current) return;

  hasBeenCalled.current = true;

  callback();
};

export default useConstructor;
