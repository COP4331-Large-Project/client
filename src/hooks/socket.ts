import { useContext } from 'react';
import { Socket } from 'socket.io-client';
import SocketContext from '../contexts/SocketContext';

function useSocket(): Socket {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error(
      'Invalid useSocket hook, hook is not within the correct context.',
    );
  }

  return socket;
}

export { useSocket };
