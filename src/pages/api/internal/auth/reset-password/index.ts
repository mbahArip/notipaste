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
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required', scope: 'email' });
  }

  // Check for user first

  const findUser = await pb.collection('notipaste_user').getList(1, 5, {
    filter: `email = "${email}"`,
  });
  if (findUser.totalItems === 0) {
    return res.status(400).json({ message: 'Email not found', scope: 'email' });
  }

  const response = await pb.collection('notipaste_user').requestPasswordReset(email);
  if (!response) {
    return res.status(400).json({ message: 'Invalid email', scope: 'form' });
  }

  return res.status(200).json({ message: 'Password reset request has been sent to your email', data: response });
}
