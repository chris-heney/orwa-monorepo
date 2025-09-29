export interface IRole {
  id: number;
  name: string;
  description: string;
}
export interface IUser {
  id: number;
  username: string;
  email: string;
  role: IRole;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  provider: string;
  wp_uid: number;
  user_preferences: any;
}
