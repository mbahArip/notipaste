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
  const { username, email, password, confirmPassword } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required', scope: 'username' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Email is required', scope: 'email' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required', scope: 'password' });
  }
  if (!confirmPassword) {
    return res.status(400).json({ message: 'Confirm password is required', scope: 'confirmPassword' });
  }

  // Check for user first

  const findUser = await pb.collection('notipaste_user').getList(1, 5, {
    filter: `username = "${username}" || email = "${email}"`,
  });
  if (findUser.totalItems > 0) {
    const findUsername = findUser.items.find((item) => item.username === username);
    const findEmail = findUser.items.find((item) => item.email === email);
    if (findUsername) {
      return res.status(400).json({ message: 'Username already taken', scope: 'username' });
    }
    if (findEmail) {
      return res.status(400).json({ message: 'Email already taken', scope: 'email' });
    }
  }

  const response = await pb.collection('notipaste_user').create({
    username,
    email,
    password,
    passwordConfirm: confirmPassword,
  });
  if (!response) {
    return res.status(400).json({ message: 'Failed to create account', scope: 'auth' });
  }
  await pb.collection('notipaste_user').requestVerification(email);

  return res
    .status(201)
    .json({ message: 'Account created, please check your email to verify your account', data: response });
}
