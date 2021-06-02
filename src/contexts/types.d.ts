import { Group, Image, User } from '../types';

// Group

export type GroupContextType = {
  dispatch: React.Dispatch<GroupAction>;
  state: GroupState;
};

export type GroupState = {
  groups: Group[];
  images: Image[];
  index: number;
};

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

// User

export type UserContextType = {
  dispatch: React.Dispatch<UserAction>;
  state: User;
};

export type UserAction = {
  type: 'updateUser';
  payload: User;
};

export type LoadingState = {
  groupsLoading: boolean;
  imagesLoading: boolean;
};
