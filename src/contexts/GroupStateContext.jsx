import React, { createContext, useContext } from 'react';

const GroupsStateContext = createContext(undefined);

function useGroupState() {
  const state = useContext(GroupsStateContext);

  if (!state) {
    throw new Error('Invalid useGroupState hook, hook is not within the correct context.');
  }

  return state;
}

// eslint-disable-next-line react/prop-types
function GroupsStateProvider({ value, children }) {
  return (
        <GroupsStateContext.Provider value={value}>
            {children}
        </GroupsStateContext.Provider>
  );
}

export { GroupsStateContext as default, useGroupState, GroupsStateProvider };
