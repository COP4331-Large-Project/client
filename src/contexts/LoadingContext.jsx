import { createContext } from 'react';

const LoadingContext = createContext({
  groupLoading: false,
  imagesLoading: false,
});

export default LoadingContext;
