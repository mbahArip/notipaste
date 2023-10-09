import bcrypt from 'bcrypt';

export function encryptPassword(password: string): string {
  try {
    const SALT = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, SALT);
  } catch (error: any) {
    console.error(error);
    return '';
  }
}
export function comparePassword({ password, hash }: Record<'password' | 'hash', string>): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error: any) {
    console.error(error);
    return false;
  }
}
