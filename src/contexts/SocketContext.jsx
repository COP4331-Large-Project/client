import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const SocketContext = createContext(undefined);

function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error(
      'Invalid useSocket hook, hook is not within the correct context.',
    );
  }

  return socket;
}

function SocketProvider({ value, children }) {
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

SocketProvider.propTypes = {
  value: PropTypes.instanceOf('Socket').isRequired,
  children: PropTypes.node.isRequired,
};

export { SocketContext as default, useSocket, SocketProvider };
