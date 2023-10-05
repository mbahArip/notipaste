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
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required', scope: 'username' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required', scope: 'password' });
  }

  // Check for user first

  const findUser = await pb.collection('notipaste_user').getList(1, 5, {
    filter: `username = "${username}"`,
  });
  if (findUser.totalItems === 0) {
    return res.status(400).json({ message: 'Username not found', scope: 'username' });
  }

  const response = await pb.collection('notipaste_user').authWithPassword(username, password);
  const verified = response.record.verified as boolean;
  if (!verified) {
    return res
      .status(400)
      .json({ message: 'Account not verified. Please check your email for verification link', scope: 'auth' });
  }
  const cookie = pb.authStore.exportToCookie({
    httpOnly: false,
  });
  res.setHeader('Set-Cookie', cookie);

  return res.status(200).json({ message: 'Login success', data: response });
}
