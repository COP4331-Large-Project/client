import { useContext } from 'react';
import SocketContext from '../contexts/SocketContext.jsx';

function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error(
      'Invalid useSocket hook, hook is not within the correct context.',
    );
  }

  return socket;
}

// eslint-disable-next-line import/prefer-default-export
export { useSocket };
