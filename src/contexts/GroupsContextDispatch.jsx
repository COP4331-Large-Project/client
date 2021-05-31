import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import groupReducer from '../reducers/group';

const GroupsDispatchContext = createContext(undefined);

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
  GroupsProvider,
};
