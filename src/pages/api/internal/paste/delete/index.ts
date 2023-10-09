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
  const { deleteToken } = req.body;
  if (!deleteToken) {
    return res.status(400).json({ message: 'Delete token is required', scope: 'deleteToken' });
  }

  const findPaste = await pb.collection('notipaste_bin').getList(1, 1, {
    filter: `delete_token = "${deleteToken}" && author = ""`,
  });
  if (!findPaste.totalItems) {
    return res.status(400).json({ message: 'Invalid delete token', scope: 'deleteToken' });
  }

  await pb.collection('notipaste_bin').delete(findPaste.items[0].id);

  return res.status(200).json({ message: 'Paste deleted!' });
}
