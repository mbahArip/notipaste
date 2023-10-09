import { RecordModel } from 'pocketbase';

export interface User extends RecordModel {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  created: string;
  updated: string;
}
