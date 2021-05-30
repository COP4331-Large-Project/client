import { createContext, useContext } from 'react';

const UserStateContext = createContext(undefined);

function useUserState() {
  const userState = useContext(UserStateContext);

  if (!userState) {
    throw new Error('Invalid useUserState hook, hook is not within the correct context.');
  }

  return userState;
}

export { UserStateContext as default, useUserState };
