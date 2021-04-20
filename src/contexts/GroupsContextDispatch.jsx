import { createContext } from 'react';

const GroupsDispatchContext = createContext(null);

function groupReducer(state, action) {
  const { index } = action.payload;

  switch (action.type) {
    case 'setIndex':
      return {
        ...state,
        index: action.payload,
      };
    case 'setImages':
      return {
        ...state,
        images: action.payload,
      };
    case 'addGroup':
      // Side note: index is here is optional. If passed, this will cause the
      // state to update the index which will in turn set the selected group
      // to the value of index. If index isn't passed, the selected group
      // will remain unchanged.
      return {
        ...state,
        groups: [...state.groups, action.payload.group],
        index: index === null || index === undefined ? state.index : index,
      };
    case 'addImage':
      return {
        ...state,
        images: [...state.images, action.payload],
      };
    case 'init':
      return {
        groups: action.payload.groups,
        images: action.payload.images,
        index: action.payload.index,
      };
    default:
      throw new Error('Invalid Group reducer action.');
  }
}

export { GroupsDispatchContext as default, groupReducer };
