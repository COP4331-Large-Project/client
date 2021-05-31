import { createContext, useReducer } from 'react';
import { User } from '../types';
import userReducer from '../reducers/user';

type UserContextType = {
  dispatch: React.Dispatch<UserAction>;
  state: User;
}

const UserDispatchContext = createContext<UserContextType | undefined>(undefined);

export type UserAction = {
  type: 'updateUser';
  payload: User;
}

type UserProviderProps = { children: React.ReactNode }

function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, {} as User);

  return (
    <UserDispatchContext.Provider value={{ state, dispatch }}>
      {children}
    </UserDispatchContext.Provider>
  );
}

export {
  UserDispatchContext as default, UserProvider,
};
