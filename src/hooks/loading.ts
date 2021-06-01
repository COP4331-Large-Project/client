import { useContext } from 'react';
import LoadingContext from '../contexts/LoadingContext';

function useLoading(): { groupsLoading: boolean; imagesLoading: boolean } {
  const loading = useContext(LoadingContext);

  if (!loading) {
    throw new Error('Invalid useLoading hook, hook is not within the correct context.');
  }

  return loading;
}

export { useLoading };
