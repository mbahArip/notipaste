/**
 * This file was @generated using typed-pocketbase
 */

// https://pocketbase.io/docs/collections/#base-collection
type BaseCollectionRecord = {
  id: string;
  created: string;
  updated: string;
};

// https://pocketbase.io/docs/collections/#auth-collection
type AuthCollectionRecord = {
  id: string;
  created: string;
  updated: string;
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
};

// https://pocketbase.io/docs/collections/#view-collection
type ViewCollectionRecord = {
  id: string;
};

// utilities

type MaybeArray<T> = T | T[];

// ===== users =====

export type UsersResponse = {
  name?: string;
  avatar?: string;
} & AuthCollectionRecord;

export type UsersCreate = {
  name?: string;
  avatar?: string;
};

export type UsersUpdate = {
  name?: string;
  avatar?: string;
};

export type UsersCollection = {
  type: 'auth';
  collectionId: '_pb_users_auth_';
  collectionName: 'users';
  response: UsersResponse;
  create: UsersCreate;
  update: UsersUpdate;
  relations: {};
};

// ===== notipaste_user =====

export type NotipasteUserResponse = {
  avatar?: string;
} & AuthCollectionRecord;

export type NotipasteUserCreate = {
  avatar?: string;
} & Partial<AuthCollectionRecord> & {
    password: string;
    passwordConfirm: string;
  };

export type NotipasteUserUpdate = {
  avatar?: string;
} & Partial<AuthCollectionRecord & { password: string; passwordConfirm: string }>;

export type NotipasteUserCollection = {
  type: 'auth';
  collectionId: 'kf0b6za105vcfu0';
  collectionName: 'notipaste_user';
  response: NotipasteUserResponse;
  create: NotipasteUserCreate;
  update: NotipasteUserUpdate;
  relations: {
    'notipaste_bin(author)': NotipasteBinCollection[];
  };
};

// ===== notipaste_bin =====

export type NotipasteBinResponse = {
  author?: string;
  title: string;
  encrypted_content: string;
  description?: string;
  password?: string;
  custom_identifier?: string;
  views: number;
  privacy: string;
  delete_token: string;
} & BaseCollectionRecord;

export type NotipasteBinCreate = {
  author?: string;
  title: string;
  encrypted_content: string;
  description?: string;
  password?: string;
  custom_identifier?: string;
  views: number;
  privacy: string;
  delete_token: string;
};

export type NotipasteBinUpdate = {
  author?: string;
  title?: string;
  encrypted_content?: string;
  description?: string;
  password?: string;
  custom_identifier?: string;
  views?: number;
  privacy?: string;
  delete_token?: string;
};

export type NotipasteBinCollection = {
  type: 'base';
  collectionId: 'swgbh8amhrogeyx';
  collectionName: 'notipaste_bin';
  response: NotipasteBinResponse;
  create: NotipasteBinCreate;
  update: NotipasteBinUpdate;
  relations: {
    author: NotipasteUserCollection;
  };
};

// ===== Schema =====

export type Schema = {
  users: UsersCollection;
  notipaste_user: NotipasteUserCollection;
  notipaste_bin: NotipasteBinCollection;
};
