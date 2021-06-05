import { createContext, useReducer } from 'react';
import userReducer from '../reducers/user';
import { User } from '../types';
import { UserContextType } from './types';

const UserDispatchContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = { children: React.ReactNode };

function UserProvider({ children }: UserProviderProps): JSX.Element {
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
