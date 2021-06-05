import { useContext } from 'react';
import { UserContextType } from '../contexts/types';
import UserDispatchContext from '../contexts/UserContextDispatch';
import { User } from '../types';

/**
 * Fetches the user dispatch and state from the context.
 */
function useUser(): UserContextType  {
  const context = useContext(UserDispatchContext);

  if (!context) {
    throw new Error('Invalid useUser hook, hook is not within the correct context.');
  }

  return context;
}

/**
 * Fetches the user state from the context.
 */
function useUserState(): User {
  return useUser().state;
}

export { useUser, useUserState };
