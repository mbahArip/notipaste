import { NextApiRequest, NextApiResponse } from 'next';

import pb from 'utils/pocketbase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await Get(req, res);
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

async function Get(req: NextApiRequest, res: NextApiResponse) {
  // await pb.admins.authWithPassword(process.env.POCKETBASE_EMAIL as string, process.env.POCKETBASE_PASSWORD as string);
  // if (!pb.authStore.isAdmin) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  const tokenHeaders = req.headers.authorization;
  if (!tokenHeaders) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const data = await pb.collection('notipaste_bin').getFullList();

  const totalItems = data.length;
  const totalViews = data.reduce((acc, cur) => acc + cur.views, 0);

  return res.status(200).json({
    message: 'success',
    data: {
      totalItems,
      totalViews,
    },
  });
}
