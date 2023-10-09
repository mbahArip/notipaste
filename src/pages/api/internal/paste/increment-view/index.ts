import { NextApiRequest, NextApiResponse } from 'next';

import { decryptData } from 'utils/encryptionHelper';
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
  const { token, pasteId } = req.body;
  if (!token) return res.status(400).json({ message: 'Token is required' });
  if (!pasteId) return res.status(400).json({ message: 'Paste ID is required' });

  const decryptedToken = decryptData(token);
  const now = Date.now();
  const tokenDate = new Date(decryptedToken);
  const valid =
    tokenDate.getFullYear() === new Date(now).getFullYear() &&
    tokenDate.getMonth() === new Date(now).getMonth() &&
    tokenDate.getDate() === new Date(now).getDate() &&
    tokenDate.getHours() === new Date(now).getHours();

  if (!valid) throw new Error('Invalid view token');

  const data = await pb.collection('notipaste_bin').getOne(pasteId);
  await pb.collection('notipaste_bin').update(pasteId, {
    views: data.views + 1,
  });

  return res.status(200).json({
    message: 'success',
  });
}
