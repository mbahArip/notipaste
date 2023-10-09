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
  const { identifier, pasteId } = req.query;
  if (!identifier) return res.status(400).json({ message: 'Identifier is required' });

  const filter = [`custom_identifier = "${identifier}"`];
  if (pasteId) filter.push(`id != "${pasteId}"`);
  const exist = await pb.collection('notipaste_bin').getList(1, 1, {
    filter: filter.join(' && '),
  });

  return res.status(200).json({
    message: 'success',
    data: exist.totalItems > 0,
  });
}
