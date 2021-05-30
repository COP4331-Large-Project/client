import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

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

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {});

  return (
    <UserDispatchContext.Provider value={{ state, dispatch }}>
      {children}
    </UserDispatchContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useUser() {
  const context = useContext(UserDispatchContext);

  if (!context) {
    throw new Error('Invalid useUser hook, hook is not within the correct context.');
  }

  return context;
}

function useUserState() {
  return useUser().state;
}

export {
  UserDispatchContext as default, userReducer, useUser, useUserState, UserProvider,
};
