import type { AuthRecord } from 'pocketbase';

export interface User extends AuthRecord {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  created: string;
  updated: string;
}