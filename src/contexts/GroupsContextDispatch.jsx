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
        groups: [...state.groups, action.payload.group],
        index: action.payload.index,
      };
    case 'init':
      return {
        groups: action.payload.groups,
        index: action.payload.index,
      };
    default:
      throw new Error('Invalid Group reducer action.');
  }
}

export { GroupsDispatchContext as default, groupReducer };
