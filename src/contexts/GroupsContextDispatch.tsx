import { createContext, useReducer } from 'react';
import groupReducer from '../reducers/group';
import { GroupContextType } from './types';

const GroupsDispatchContext = createContext<GroupContextType | undefined>(undefined);

type GroupsProviderProps = { children: React.ReactNode };

function GroupsProvider({ children }: GroupsProviderProps): JSX.Element {
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

export {
  GroupsDispatchContext as default,
  GroupsProvider,
};
