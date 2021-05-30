import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

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
  const { dispatch, state } = useContext(GroupsDispatchContext);

  if (!dispatch || !state) {
    throw new Error(
      'Invalid useGroup hook, hook is not within the correct context.',
    );
  }

  return { dispatch, state };
}

function useGroupsState() {
  return useGroups().state;
}

function GroupsProvider({ children }) {
  // Using an initial value of -1 here so that groupData can
  // trigger updates when its value is set to 0 on mount.
  // It'll be set to 0 if there is at least one group to load.
  const [state, dispatch] = useReducer(groupReducer, {
    groups: [],
    images: [],
    index: -1,
  });

  return (
    <GroupsDispatchContext.Provider value={{ state, dispatch }}>
        {children}
    </GroupsDispatchContext.Provider>
  );
}

GroupsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  GroupsDispatchContext as default,
  groupReducer,
  useGroups,
  useGroupsState,
  GroupsProvider,
};
