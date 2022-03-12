import { NextApiRequest, NextApiResponse } from 'next';

import auth from '@/middleware/auth';
import Categories from '@/models/categoriesModel';
import connectDB from '@/utils/connectDB';

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

const updateCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await auth(req, res);
    if (result && result.role !== 'admin')
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { id } = req.query;
    const { name } = req.body;

    const newCategory = await Categories.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({
      msg: 'Success! Update a new category',
      category: {
        ...newCategory._doc,
        name,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await auth(req, res);
    if (result && result.role !== 'admin')
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { id } = req.query;

    await Categories.findByIdAndDelete(id);

    res.json({ msg: 'Success! Deleted a category' });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
