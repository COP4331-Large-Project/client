import React, { createContext, useContext, useReducer } from 'react';
import GroupsStateContext from './GroupStateContext.jsx';

const GroupsDispatchContext = createContext(undefined);

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
    case 'replaceGroups':
      return {
        ...state,
        groups: action.payload.groups,
        index: action.payload.index,
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
    case 'updateGroupMemberCount':
      return {
        ...state,
        groups: action.payload,
      };
    default:
      throw new Error(`Invalid Group reducer action ${action}.`);
  }
}

function useGroups() {
  const dispatch = useContext(GroupsDispatchContext);

  if (!dispatch) {
    throw new Error(
      'Invalid useGroup hook, hook is not within the correct context.',
    );
  }

  return { dispatch };
}

// eslint-disable-next-line react/prop-types
function GroupsProvider({ children }) {
  const [state, dispatch] = useReducer(groupReducer, {
    groups: [],
    images: [],
    index: -1,
  });

  return (
    <GroupsDispatchContext.Provider value={dispatch}>
      <GroupsStateContext.Provider value={state}>
        {children}
      </GroupsStateContext.Provider>
    </GroupsDispatchContext.Provider>
  );
}

export {
  GroupsDispatchContext as default,
  groupReducer,
  useGroups,
  GroupsProvider,
};
