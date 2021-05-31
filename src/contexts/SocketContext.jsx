import React, { createContext } from 'react';
import PropTypes from 'prop-types';

const SocketContext = createContext(undefined);

function SocketProvider({ value, children }) {
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

SocketProvider.propTypes = {
  value: PropTypes.instanceOf('Socket').isRequired,
  children: PropTypes.node.isRequired,
};

export { SocketContext as default, SocketProvider };
