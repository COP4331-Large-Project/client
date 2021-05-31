import { useContext } from 'react';
import LoadingContext from '../contexts/LoadingContext.jsx';

function useLoading() {
  const loading = useContext(LoadingContext);

  if (!loading) {
    throw new Error('Invalid useLoading hook, hook is not within the correct context.');
  }

  return loading;
}

// eslint-disable-next-line import/prefer-default-export
export { useLoading };
