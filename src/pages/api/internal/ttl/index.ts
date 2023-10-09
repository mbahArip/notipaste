import { NextApiRequest, NextApiResponse } from 'next';

import pb from 'utils/pocketbase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        return await Post(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    const isNan = isNaN(error.code);
    if (!isNan) {
      return res.status(error.code).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
}

async function Post(req: NextApiRequest, res: NextApiResponse) {
  await pb.admins.authWithPassword(process.env.POCKETBASE_EMAIL as string, process.env.POCKETBASE_PASSWORD as string);
  if (!pb.authStore.isAdmin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required', scope: 'password' });
  }
  if (password !== process.env.POCKETBASE_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const MAX_AGE = 60 * 60 * 24 * 14;

  const _paste = pb.collection('notipaste_bin').getFullList({
    filter: `(created > "${new Date(
      Date.now() - MAX_AGE * 1000,
    ).toISOString()}" && author = "") || (expires != "" && expires < "${new Date().toISOString()}")`,
  });
  const _attachments = pb.collection('notipaste_attachments').getFullList({
    filter: `paste = ""`,
  });
  const [paste, attachments] = await Promise.all([_paste, _attachments]);
  const pasteId = paste.map((item) => item.id);
  const attachmentIds = attachments.map((item) => item.id);

  if (pasteId) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await pasteId.forEach(async (id) => {
          await pb.collection('notipaste_bin').delete(id);
        });
        resolve(true);
      } catch (error: any) {
        reject(error);
      }
    });
    await promise;
  }
  if (attachmentIds) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        await attachmentIds.forEach(async (id) => {
          await pb.collection('notipaste_attachments').delete(id);
        });
        resolve(true);
      } catch (error: any) {
        reject(error);
      }
    });
    await promise;
  }

  return res.status(200).json({ message: 'Paste deleted', pasteId });
}
