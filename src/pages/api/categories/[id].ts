import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import auth from '@/middleware/auth';
import Categories from '@/models/categoriesModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';

connectDB();

export default async function handleCategoryRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      await updateCategory(req, res);
      break;
    case 'DELETE':
      await deleteCategory(req, res);
      break;
  }
}

const updateCategory = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const session = await getSession({ req });
    if (session && session.user.role !== 'admin')
      return res.status(400).json({ error: 'Authentication is not valid.' });

    const { id } = req.query;
    const { isActive } = req.body;

    await Categories.findOneAndUpdate({ _id: id }, { isActive });
    res.json({
      success: 'Success! Category state updated',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};

const deleteCategory = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const session = await getSession({ req });
    if (session && session.user.role !== 'admin')
      return res.status(400).json({ error: 'Authentication is not valid.' });

    const { id } = req.query;

    await Categories.findByIdAndDelete(id);

    res.json({ success: 'Success! Deleted a category' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
