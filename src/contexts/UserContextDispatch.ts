import { createContext } from 'react';
import { User } from '../types';

const UserDispatchContext = createContext<React.Dispatch<UserAction> | undefined>(undefined);

type UserAction = {
  type: 'updateUser';
  payload: User
}

function userReducer(_state: User, action: UserAction): User {
  switch (action.type) {
    case 'updateUser':
      return {
        ...action.payload,
      };
    default:
      throw new Error(`Invalid User reducer action ${action}`);
  }
}

export { UserDispatchContext as default, userReducer };
