import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import Categories, { Category } from '@/models/categoriesModel';
import Restaurants from '@/models/restaurantModel';
import connectDB from '@/utils/connectDB';

import { RestaurantListDTO } from '../../restaurant';

import { Notify } from '@/types';

connectDB();

export default async function handleCategoryRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getCategoryRestaurants(req, res);
      break;
    case 'PUT':
      await updateCategoryRestaurants(req, res);
      break;
  }
}

export type CategoryDetailsResponse = {
  restaurants: Array<RestaurantListDTO>;
};

const getCategoryRestaurants = async (
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

const updateCategoryRestaurants = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const userSession = await getSession({ req });
    if (userSession && userSession.user.role !== 'admin')
      return res.status(400).json({ error: 'Authentication is not valid.' });

    const { id } = req.query;
    const { restaurantId } = req.body;

    // Production Caveat to ensure its in a transaction, mongo cluster needs to be in replica locally
    // For now just update two documents separately

    const restaurant = await Restaurants.findById(restaurantId);
    restaurant.categories.push({ id });
    restaurant.save();

    const category = await Categories.findById(id);
    category.restaurants.push({ id: restaurantId });
    category.save();

    res.json({
      success: 'Success! selected restaurant linked with category',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
