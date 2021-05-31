import { useContext } from 'react';
import UserDispatchContext from '../contexts/UserContextDispatch';

/**
 * Fetches the user dispatch and state from the context.
 */
function useUser() {
  const context = useContext(UserDispatchContext);

  if (!context) {
    throw new Error('Invalid useUser hook, hook is not within the correct context.');
  }

  return context;
}

/**
 * Fetches the user state from the context.
 */
function useUserState() {
  return useUser().state;
}

export { useUser, useUserState };
