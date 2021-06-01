import { createContext, useReducer } from 'react';
import { Group, Image } from '../types';
import groupReducer from '../reducers/group';

export type GroupContextType = {
  dispatch: React.Dispatch<GroupAction>;
  state: GroupState;
};

const GroupsDispatchContext = createContext<GroupContextType | undefined>(undefined);

export type GroupAction = { type: 'setIndex'; payload: number }
| { type: 'setImages'; payload: Image[] }
| { type: 'addGroup'; payload: { group: Group; index?: number }}
| { type: 'replaceGroups'; payload: { groups: Group[]; index: number }} 
| { type: 'addImage'; payload: Image }
| { type: 'updateGroupMemberCount'; payload: Group[] }
| { type: 'init'; payload: {
  groups: Group[];
  images: Image[];
  index: number;
};};

type GroupState = {
  groups: Group[];
  images: Image[];
  index: number;
};

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
