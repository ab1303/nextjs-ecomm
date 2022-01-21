import { NextApiRequest, NextApiResponse } from 'next';

import Restaurants from '@/models/restaurantModel';
import connectDB from '@/utils/connectDB';

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

const getRestaurant = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const restaurant = await Restaurants.findById(id);
    if (!restaurant)
      return res.status(400).json({ err: 'This restaurant does not exist.' });

    res.json({ restaurant });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
