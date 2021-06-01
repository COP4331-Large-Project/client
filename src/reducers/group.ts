import { Group, Image } from '../types';

type GroupAction = { type: 'setIndex'; payload: number }
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

function groupReducer(state: GroupState, action: GroupAction): GroupState {
  const { index } = action.payload as { group: Group; index?: number };
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

export default groupReducer;
