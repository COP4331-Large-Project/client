import { createContext } from 'react';

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

export { UserDispatchContext as default, userReducer };
