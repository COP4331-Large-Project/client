import React, { createContext } from 'react';

const LoadingContext = createContext({
  groupsLoading: false,
  imagesLoading: false,
});

type LoadingProviderProps = {
  value: {
    groupsLoading: boolean;
    imagesLoading: boolean;
  };
  children: React.ReactNode;
}

function LoadingProvider({ value, children }: LoadingProviderProps) {
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export { LoadingContext as default, LoadingProvider };
