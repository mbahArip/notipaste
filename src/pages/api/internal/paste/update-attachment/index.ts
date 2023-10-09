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

  const { attachmentIds, pasteId } = req.body;
  if (!attachmentIds) return res.status(400).json({ message: 'Content is required' });
  if (!pasteId) return res.status(400).json({ message: 'Paste ID is required' });

  const attachmentIdsArray = attachmentIds.split(',');
  if (!attachmentIdsArray.length) return res.status(400).json({ message: 'Attachment IDs is required' });

  const updatePromise = new Promise(async (resolve, reject) => {
    try {
      const updated: string[] = [];
      for (const imageId of attachmentIdsArray) {
        const update = await pb.collection('notipaste_attachments').update(imageId, {
          paste: pasteId,
        });
        updated.push(update.id);
      }
      resolve(updated);
    } catch (error: any) {
      reject(error);
    }
  });
  await updatePromise.finally(() => {
    return res.status(200).json({
      message: 'success',
    });
  });
}
