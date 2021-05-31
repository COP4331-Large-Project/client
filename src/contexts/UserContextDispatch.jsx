import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import userReducer from '../reducers/user';

const UserDispatchContext = createContext(null);

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

export {
  UserDispatchContext as default, UserProvider,
};
