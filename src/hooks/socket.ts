import { useContext } from 'react';
import SocketContext from '../contexts/SocketContext';

function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error(
      'Invalid useSocket hook, hook is not within the correct context.',
    );
  }

  return socket;
}

export { useSocket };
