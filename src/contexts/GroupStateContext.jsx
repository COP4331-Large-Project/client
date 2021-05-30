import { createContext, useContext } from 'react';

const GroupsStateContext = createContext(undefined);

function useGroupState() {
  const state = useContext(GroupsStateContext);

  if (!state) {
    throw new Error('Invalid useGroupState hook, hook is not within the correct context.');
  }

  return state;
}

export { GroupsStateContext as default, useGroupState };
