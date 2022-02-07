import { NextApiRequest, NextApiResponse } from 'next';

import addressModelToAddressMap from '@/mappers/addressMapper';
import Restaurants, { Restaurant } from '@/models/restaurantModel';
import connectDB from '@/utils/connectDB';

import { Address, Notify } from '@/types';

connectDB();

export default async function handleRestaurantRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getRestaurant(req, res);
      break;
  }
}

export type GetRestaurantDTO = {
  _id: number;
  name: string;
  image: string;
  cuisine: string;
  contact: string;
  address: Address;
};

export type GetRestaurantResponse = {
  restaurant: GetRestaurantDTO;
};

const getRestaurant = async (
  req: NextApiRequest,
  res: NextApiResponse<GetRestaurantResponse | Notify>
) => {
  try {
    const { id } = req.query;

    const restaurant: Restaurant = await Restaurants.findById(id);
    if (!restaurant)
      return res.status(400).json({ error: 'This restaurant does not exist.' });

    res.json({
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        image: restaurant.image,
        cuisine: restaurant.cuisine,
        contact: restaurant.contact,
        address: addressModelToAddressMap(restaurant.address),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
