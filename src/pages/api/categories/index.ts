import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import Categories, { Category } from '@/models/categoriesModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';

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

export type CreateCategoryResponse = {
  id: number;
  name: string;
} & Notify;

const createCategory = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateCategoryResponse | Notify>
) => {
  try {
    const session = await getSession({ req });
    if (session && session.user.role !== 'admin')
      return res.status(400).json({ error: 'Authentication is not valid.' });

    const { categoryName } = req.body;
    if (!categoryName)
      return res
        .status(400)
        .json({ error: 'Category Name can not be left blank.' });

    const newCategory = new Categories({ name: categoryName });

    await newCategory.save();

    res.json({
      id: newCategory._id,
      name: newCategory.name,
      success: 'Success! Created a new category',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};

export type CategoryListDTO = {
  _id: number;
  name: string;
};

export type CategoriesResponse = {
  categories: Array<CategoryListDTO>;
};

const getCategories = async (
  req: NextApiRequest,
  res: NextApiResponse<CategoriesResponse | Notify>
) => {
  try {
    const categories: Array<Category> = await Categories.find();

    const result: Array<CategoryListDTO> = categories.map((c) => ({
      _id: c._id,
      name: c.name,
    }));

    res.json({ categories: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
