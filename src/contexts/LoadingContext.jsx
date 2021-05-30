import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

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

function LoadingProvider({ value, children }) {
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

LoadingProvider.propTypes = {
  value: PropTypes.shape({
    groupsLoading: PropTypes.bool.isRequired,
    imagesLoading: PropTypes.bool.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export { LoadingContext as default, useLoading, LoadingProvider };
