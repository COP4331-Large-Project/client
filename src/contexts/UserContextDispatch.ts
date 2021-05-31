import { createContext, useReducer } from 'react';
import { User } from '../types';
import userReducer from '../reducers/user';

const UserDispatchContext = createContext<React.Dispatch<UserAction> | undefined>(undefined);

type UserAction = {
  type: 'updateUser';
  payload: User;
};

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
