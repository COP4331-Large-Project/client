import { createContext } from 'react';

const LoadingContext = createContext({
  groupsLoading: false,
  imagesLoading: false,
});

export default LoadingContext;
