import { NextApiRequest, NextApiResponse } from 'next';

import auth from '@/middleware/auth';
import Categories from '@/models/categoriesModel';
import connectDB from '@/utils/connectDB';

connectDB();

export default async function handleCategoriesRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      await createCategory(req, res);
      break;
    case 'GET':
      await getCategories(req, res);
      break;
  }
}

const createCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await auth(req, res);
    if (result && result.role !== 'admin')
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { name } = req.body;
    if (!name)
      return res.status(400).json({ err: 'Name can not be left blank.' });

    const newCategory = new Categories({ name });

    await newCategory.save();
    res.json({
      msg: 'Success! Created a new category.',
      newCategory,
    });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

const getCategories = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const categories = await Categories.find();

    res.json({ categories });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
