import { useContext } from 'react';
import GroupsDispatchContext from '../contexts/GroupsContextDispatch.jsx';

/**
 * Fetches the group dispatch and state from the context.
 */
function useGroups() {
  const context = useContext(GroupsDispatchContext);

  if (!context) {
    throw new Error(
      'Invalid useGroups hook, hook is not within the correct context.',
    );
  }

  return context;
}

/**
 * Fetches the group state from the context.
 */
function useGroupsState() {
  return useGroups().state;
}

export { useGroups, useGroupsState };
