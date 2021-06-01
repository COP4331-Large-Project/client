import { User } from '../types';

type BaseUser = Omit<User, '_id' | 'id' | 'imgURL'>;

export type ImageUploadResponse = {
  caption?: string;
  fileName: string;
  creator: string;
  groupId: string;
  dateUploaded: string;
  URL: string;
  id: string;
};

export type AccountParams = BaseUser & {
  token: string;
  userId: string;
};

export type ImageObject = {
  id: string;
  fileName: string;
  creator: string;
  dateUploaded: string;
  URL: string;
};

export type UserResponse = BaseUser & {
  id: string;
  token?: string;
};

export type GroupResponse = {
  name: string;
  id: string;
  creator: UserResponse;
  thumbnail: ImageObject;
  memberCount: number;
  publicGroup: boolean;
  invitedUsers: UserResponse[];
  images: Image[];
  inviteCode: string;
};

export type GroupOptions = {
  name: string;
  publicGroup: boolean;
  creator: string;
  emails: string[];
};
export type ImageUploadOptions = {
  image: File;
  userId: string;
  groupId: string;
  caption?: string;
};

export type RegistrationOptions = UserBase &  { password: string };
