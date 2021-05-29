import { createContext } from 'react';
import { Group, Image } from '../types';

type GroupState = {
    groups: Group[],
    images: Image[],
    index: number,
}

const GroupsStateContext = createContext<GroupState>({
    groups: [],
    images: [],
    index: -1
});

export default GroupsStateContext;
