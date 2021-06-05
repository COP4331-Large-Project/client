import { useContext } from 'react';
import GroupsDispatchContext from '../contexts/GroupsContextDispatch';
import { GroupContextType } from '../contexts/types';

/**
 * Fetches the group dispatch and state from the context.
 */
function useGroups(): GroupContextType {
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
function useGroupsState(): GroupContextType['state'] {
  return useGroups().state;
}

export { useGroups, useGroupsState };
