enum Constant {
  'cookies-token' = 'authToken',
}
export enum Routes {
  HOME = '/',
  ABOUT = '/about',
  FAQ = '/faq',
  TOS = '/terms-of-services',

  NEW_PASTE = '/paste/new',
  DELETE_PASTE = '/delete',

  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  FORGOT_PASSWORD = '/auth/forgot-password',

  PROFILE = '/profile',
  SETTINGS = '/profile/settings',
}

export default Constant;

export * as DefaultSEOConfig from './defaultSEO';
