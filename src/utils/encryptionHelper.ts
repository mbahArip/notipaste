import crypto from 'crypto';

const generateKey = () => {
  let env = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  if (!env) throw new Error('Encryption key is not set');
  if (env.length < 16) env = env.padEnd(16, '0');
  if (env.length > 16) env = env.slice(0, 16);
  return env;
};
const key = generateKey();
const iv = Buffer.from(key);

export function encryptData(data: string): string {
  try {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]).toString('hex');
  } catch (error: any) {
    console.error(error);
    return '';
  }
}

export function decryptData(data: string): string {
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return Buffer.concat([decipher.update(Buffer.from(data, 'hex')), decipher.final()]).toString('utf8');
  } catch (error: any) {
    console.error(error);
    return '';
  }
}
