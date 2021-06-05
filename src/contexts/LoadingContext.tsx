import React, { createContext } from 'react';
import { LoadingState } from './types';

const LoadingContext = createContext<LoadingState | undefined>({
  groupsLoading: false,
  imagesLoading: false,
});

type LoadingProviderProps = {
  value: {
    groupsLoading: boolean;
    imagesLoading: boolean;
  };
  children: React.ReactNode;
};

function LoadingProvider({ value, children }: LoadingProviderProps): JSX.Element {
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export { LoadingContext as default, LoadingProvider };
