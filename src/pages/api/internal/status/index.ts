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
    return res.status(500).json({ error: error.message });
  }
}

async function Get(req: NextApiRequest, res: NextApiResponse) {
  const health = await pb.health.check();
  if (health.code === 200) {
    return res.status(200).json({ message: 'Server is online', status: true });
  } else {
    return res.status(200).json({ message: 'Server is offline', status: false });
  }
}
