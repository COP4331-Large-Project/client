import React, { createContext, useContext } from 'react';

const UserStateContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
function UserStateProvider({ value, children }) {
  return (
        <UserStateContext.Provider value={value}>
            {children}
        </UserStateContext.Provider>
  );
}

function useUserState() {
  const userState = useContext(UserStateContext);

  if (!userState) {
    throw new Error('Invalid useUserState hook, hook is not within the correct context.');
  }

  return userState;
}

export { UserStateContext as default, useUserState, UserStateProvider };
