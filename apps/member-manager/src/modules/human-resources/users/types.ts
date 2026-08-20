export interface IRole {
  id: number;
  name: string;
  description: string;
}
export interface IUser {
  id: number;
  username: string;
  email: string;
  // Users can exist with no role assigned (legacy imports); guard every read.
  role: IRole | null;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  provider: string;
  wp_uid: number;
  user_preferences: any;
}
