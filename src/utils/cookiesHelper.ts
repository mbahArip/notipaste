class CookieHelper {
  static create(
    name: string,
    value: string,
    opts?: {
      expires?: string;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax';
      httpOnly?: boolean;
    },
  ) {
    const buildCookie = `${name}=${value};`;
    const expires = opts?.expires ? `expires=${opts.expires};` : '';
    const path = opts?.path ? `path=${opts.path};` : '';
    const domain = opts?.domain ? `domain=${opts.domain};` : '';
    const secure = opts?.secure ? `secure=${opts.secure};` : '';
    const sameSite = opts?.sameSite ? `sameSite=${opts.sameSite};` : '';
    const httpOnly = opts?.httpOnly ? `httpOnly=${opts.httpOnly};` : '';

    const cookie = `${buildCookie}${expires}${path}${domain}${secure}${sameSite}${httpOnly}`;
    document.cookie = cookie;
  }

  static get(name: string) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }

  static delete(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

const cookieHelper = CookieHelper;

export default cookieHelper;
