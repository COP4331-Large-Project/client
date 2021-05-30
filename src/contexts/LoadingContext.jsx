import React, { createContext, useContext } from 'react';

const LoadingContext = createContext({
  groupLoading: false,
  imagesLoading: false,
});

function useLoading() {
  const loading = useContext(LoadingContext);

  if (!loading) {
    throw new Error('Invalid useLoading hook, hook is not within the correct context.');
  }

  return loading;
}

// eslint-disable-next-line react/prop-types
function LoadingProvider({ value, children }) {
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export { LoadingContext as default, useLoading, LoadingProvider };
