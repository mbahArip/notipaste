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
  expires?: string;
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
  expires?: string;
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
  expires?: string;
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
// ===== notipaste_attachments =====

export type NotipasteAttachmentsResponse = {
  uploader: string;
  paste?: string;
  file: string;
} & BaseCollectionRecord;

export type NotipasteAttachmentsCreate = {
  uploader: string;
  paste?: string;
  file: string;
};

export type NotipasteAttachmentsUpdate = {
  uploader?: string;
  paste?: string;
  file?: string;
};

export type NotipasteAttachmentsCollection = {
  type: 'base';
  collectionId: 'dp91x98qzjap5a2';
  collectionName: 'notipaste_attachments';
  response: NotipasteAttachmentsResponse;
  create: NotipasteAttachmentsCreate;
  update: NotipasteAttachmentsUpdate;
  relations: {
    uploader: NotipasteUserCollection;
    paste: NotipasteBinCollection;
  };
};
// ===== notipaste_reports =====

export type NotipasteReportsResponse = {
  paste: string;
  reason: string;
  reporter?: string;
} & BaseCollectionRecord;

export type NotipasteReportsCreate = {
  paste: string;
  reason: string;
  reporter?: string;
};

export type NotipasteReportsUpdate = {
  paste?: string;
  reason?: string;
  reporter?: string;
};

export type NotipasteReportsCollection = {
  type: 'base';
  collectionId: '21zgr02w36rdtob';
  collectionName: 'notipaste_reports';
  response: NotipasteReportsResponse;
  create: NotipasteReportsCreate;
  update: NotipasteReportsUpdate;
  relations: {
    paste: NotipasteBinCollection;
  };
};

// ===== notipaste_global =====

export type NotipasteGlobalResponse = {
  key: string;
  value: string;
} & BaseCollectionRecord;

export type NotipasteGlobalCreate = {
  key: string;
  value: string;
};

export type NotipasteGlobalUpdate = {
  key?: string;
  value?: string;
};

export type NotipasteGlobalCollection = {
  type: 'base';
  collectionId: 'fezf88zavtb16vh';
  collectionName: 'notipaste_global';
  response: NotipasteGlobalResponse;
  create: NotipasteGlobalCreate;
  update: NotipasteGlobalUpdate;
  relations: {
    paste: NotipasteBinCollection;
  };
};

// ===== Schema =====

export type Schema = {
  users: UsersCollection;
  notipaste_user: NotipasteUserCollection;
  notipaste_bin: NotipasteBinCollection;
  notipaste_attachments: NotipasteAttachmentsCollection;
  notipaste_reports: NotipasteReportsCollection;
  notipaste_global: NotipasteGlobalCollection;
};
