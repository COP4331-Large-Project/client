import React, { createContext, useContext, useReducer } from 'react';
import UserStateContext from './UserStateContext.jsx';

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
function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {});

  return (
    <UserDispatchContext.Provider value={dispatch}>
      <UserStateContext.Provider value={state}>
        {children}
      </UserStateContext.Provider>
    </UserDispatchContext.Provider>
  );
}

function useUser() {
  const dispatch = useContext(UserDispatchContext);

  if (!dispatch) {
    throw new Error('Invalid useUser hook, hook is not within the correct context.');
  }

  return { dispatch };
}

export {
  UserDispatchContext as default, userReducer, useUser, UserProvider,
};
