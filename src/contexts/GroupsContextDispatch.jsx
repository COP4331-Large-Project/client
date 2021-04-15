import { createContext } from 'react';

const GroupsDispatchContext = createContext(null);

function groupReducer(state, action) {
  switch (action.type) {
    case 'setIndex':
      return { groups: state.groups, index: action.payload };
    case 'init':
      return { groups: action.payload, index: 0 };
    default:
      throw new Error('Invalid Group reducer action.');
  }
}

export default GroupsDispatchContext;
export { groupReducer };
