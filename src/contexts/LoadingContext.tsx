import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const LoadingContext = createContext({
  groupsLoading: false,
  imagesLoading: false,
});

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

export { LoadingContext as default, LoadingProvider };
