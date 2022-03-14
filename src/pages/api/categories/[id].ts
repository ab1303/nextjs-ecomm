import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import auth from '@/middleware/auth';
import Categories, { Category } from '@/models/categoriesModel';
import Restaurants, { Restaurant } from '@/models/restaurantModel';
import connectDB from '@/utils/connectDB';

import { RestaurantListDTO } from '../restaurant';

import { Notify } from '@/types';

connectDB();

export default async function handleCategoryRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getCategoryDetails(req, res);
      break;
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

export type CategoryDetailsResponse = {
  restaurants: Array<RestaurantListDTO>;
};

const getCategoryDetails = async (
  req: NextApiRequest,
  res: NextApiResponse<CategoryDetailsResponse | Notify>
) => {
  try {
    const session = await getSession({ req });
    if (session && session.user.role !== 'admin')
      return res.status(400).json({ error: 'Authentication is not valid.' });

    const { id } = req.query;

    const category: Category = await Categories.findById(id);
    const restaurantIds = category.restaurants.map((r: { id: string }) => r.id);

    const restaurants = await Restaurants.find({
      _id: {
        $in: restaurantIds.map((rid) => new mongoose.Types.ObjectId(rid)),
      },
    });

    const result: Array<RestaurantListDTO> = restaurants.map((r) => ({
      _id: r._id,
      name: r.name,
      image: r.image,
      cuisine: r.cuisine,
      contact: r.contact,
      address: r.address.addressLine,
    }));

    res.json({
      restaurants: result,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
