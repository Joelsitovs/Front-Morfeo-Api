export interface UserInterface {}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: string[];
}
export interface BasicUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles: string[];
}