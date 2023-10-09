import { NextApiRequest, NextApiResponse } from 'next';

import { encryptData } from 'utils/encryptionHelper';
import { encryptPassword } from 'utils/passwordEncryptionHelper';
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
  const { author, title, content, description, password, identifier, privacy, deleteToken, expires } = req.body;
  if (!content)
    return res.status(400).json({
      message: 'Content is required',
    });
  if (!title)
    return res.status(400).json({
      message: 'Title is required',
    });
  if (!privacy)
    return res.status(400).json({
      message: 'Privacy is required',
    });
  if (!deleteToken)
    return res.status(400).json({
      message: 'Delete token is required',
    });

  if (privacy !== 'public' && privacy !== 'private')
    return res.status(400).json({
      message: 'Privacy must be either public or private',
    });

  const create = await pb.collection('notipaste_bin').create({
    author,
    title,
    encrypted_content: encryptData(content),
    description,
    password: password ? encryptPassword(password) : undefined,
    custom_identifier: identifier,
    views: 0,
    privacy,
    delete_token: deleteToken,
    expires,
  });

  return res.status(200).json({
    message: 'success',
    data: create,
  });
}
