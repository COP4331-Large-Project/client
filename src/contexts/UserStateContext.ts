import { createContext } from 'react';
import { User } from '../types';

const UserStateContext = createContext<User | undefined>(undefined);

export default UserStateContext;
