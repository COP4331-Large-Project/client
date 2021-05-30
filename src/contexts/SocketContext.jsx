import React, { createContext, useContext } from 'react';

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

// eslint-disable-next-line react/prop-types
function SocketProvider({ value, children }) {
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { SocketContext as default, useSocket, SocketProvider };
