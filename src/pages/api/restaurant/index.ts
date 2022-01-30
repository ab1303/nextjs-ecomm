import { Query } from 'mongoose';
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
      await getRestaurants(req, res);
      break;
    case 'POST':
      await createRestaurant(req, res);
      break;
  }
}

class APIfeatures {
  query: any;
  queryString: {
    [key: string]: string | string[];
  };
  constructor(
    query: Query<any[], any, Record<string, unknown>, any>,
    queryString: {
      [key: string]: string | string[];
    }
  ) {
    this.query = query;
    this.queryString = queryString;
  }
}

const getRestaurants = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const features = new APIfeatures(Restaurants.find(), req.query);

    const restaurants = await features.query;

    res.json({
      status: 'success',
      result: restaurants.length,
      restaurants,
    });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

const createRestaurant = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const newRestaurant1 = new Restaurants({
      name: 'Domino Sydney',
      image: '/images/restaurant/domino-sydney.jpg',
      address: 'North Sydney',
      cuisine: 'Western',
      contact: 'domino@domino.com',
      menu: [
        {
          title: 'Pizza',
          image: 'pizza.jpg',
          description: 'BBQ Pizza',
          category: 'Dinner',
          price: 20,
        },
      ],
    });
    await newRestaurant1.save();

    const newRestaurant2 = new Restaurants({
      name: 'Darling Kebabs',
      image: '/images/restaurant/darling-kebabs.jpg',
      address: 'Sydney',
      cuisine: 'Middle Eastern',
      contact: 'kebabs@kebab.com',
      menu: [
        {
          title: 'Kebabs',
          image: 'kebabs.jpg',
          description: 'Chicken Kebab',
          category: 'Lunch',
          price: 50,
        },
      ],
    });
    await newRestaurant2.save();

    res.json({ msg: 'Success! Created a new restaurant' });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
