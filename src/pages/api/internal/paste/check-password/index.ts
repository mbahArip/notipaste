import { NextApiRequest, NextApiResponse } from 'next';

import { comparePassword } from 'utils/passwordEncryptionHelper';

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
  const { password, hash } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });
  if (!hash) return res.status(400).json({ message: 'Hash is required' });

  const valid = comparePassword({ password, hash });

  return res.status(200).json({
    message: 'success',
    data: valid,
  });
}
