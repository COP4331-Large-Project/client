import React, { createContext, useContext } from 'react';

const UserDispatchContext = createContext(null);

function userReducer(state, action) {
  switch (action.type) {
    case 'updateUser':
      return {
        ...action.payload,
      };
    default:
      throw new Error(`Invalid User reducer action ${action}`);
  }
}

// eslint-disable-next-line react/prop-types
function UserProvider({ user, children }) {
  return (
    <UserDispatchContext.Provider value={user}>
      {children}
    </UserDispatchContext.Provider>
  );
}

function useUser() {
  const dispatch = useContext(UserDispatchContext);

  if (!dispatch) {
    throw new Error('Invalid useUser hook, hook is not within the correct context.');
  }

  return dispatch;
}

export {
  UserDispatchContext as default, userReducer, useUser, UserProvider,
};
