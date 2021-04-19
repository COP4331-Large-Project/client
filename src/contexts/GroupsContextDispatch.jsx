import { createContext } from 'react';

const GroupsDispatchContext = createContext(null);

function groupReducer(state, action) {
  switch (action.type) {
    case 'setIndex':
      return {
        ...state,
        index: action.payload,
      };
    case 'addGroup':
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };
    case 'init':
      return { groups: action.payload, index: 0 };
    default:
      throw new Error('Invalid Group reducer action.');
  }
}

export { GroupsDispatchContext as default, groupReducer };
