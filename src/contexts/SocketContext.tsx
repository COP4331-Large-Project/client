import React, { createContext } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | undefined>(undefined);

type SocketProviderTypes = {
  value: Socket;
  children: React.ReactNode;
};

function SocketProvider({ value, children }: SocketProviderTypes): JSX.Element {
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export { SocketContext as default, SocketProvider};
