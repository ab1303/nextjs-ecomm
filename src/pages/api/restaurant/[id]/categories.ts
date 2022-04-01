import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import Categories from '@/models/categoriesModel';
import Restaurants from '@/models/restaurantModel';
import connectDB from '@/utils/connectDB';

import { RestaurantListDTO } from '..';

import { Notify } from '@/types';

connectDB();

export default async function handleCategoryRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      await updateRestaurantCategories(req, res);
      break;
  }
}

export type CategoryRestaurantListDTO = Omit<RestaurantListDTO, 'categories'>;

export type CategoryRestaurants = Array<CategoryRestaurantListDTO>;

export type CategoryDetailsResponse = {
  restaurants: CategoryRestaurants;
};

const updateRestaurantCategories = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const userSession = await getSession({ req });
    if (userSession && userSession.user.role !== 'admin')
      return res.status(400).json({ error: 'Authentication is not valid.' });

    const { id } = req.query;
    const { categoryId } = req.body;

    // Production Caveat to ensure its in a transaction, mongo cluster needs to be in replica locally
    // For now just update two documents separately

    await Categories.updateOne(
      { _id: categoryId },
      { $pull: { restaurants: { id } } },
      { safe: true, multi: false }
    );

    await Restaurants.updateOne(
      { _id: id },
      { $pull: { categories: { id: categoryId } } },
      { safe: true, multi: false }
    );

    res.json({
      success: 'Success! selected category unlinked with restaurant ',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
