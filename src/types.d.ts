export type User = {
  id: string;
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  imgURL?: string;
};

export type Image = {
  id: string;
  fileName: string;
  creator: string;
  dateUploaded: string;
  URL: string;
  caption?: string;
};

type Group = {
  name: string;
  _id?: string;
  id: string;
  creator: User;
  thumbnail: Image | null;
  memberCount: number;
  publicGroup: boolean;
  invitedUsers: User[];
  images: Image[];
  inviteCode: string;
};