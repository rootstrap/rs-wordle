import { useContext } from 'react';
import ErrorBoundaryContext from './context';

const useErrorHandling = () => {
  return useContext(ErrorBoundaryContext);
};

export default useErrorHandling;
