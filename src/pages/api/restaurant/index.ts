import { Query } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import Restaurants from '@/models/restaurantModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';

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

  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ['page', 'sort', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.category && queryObj.category != '')
      this.query.find({ category: queryObj.category });

    if (queryObj.name && queryObj.name !== '')
      this.query.find({ name: queryObj.name });

    this.query.find();

    return this;
  }

  paginating() {
    const page = !Array.isArray(this.queryString.page)
      ? this.queryString.page
        ? +this.queryString.page * 1
        : 1
      : 1;

    const limit =
      !Array.isArray(this.queryString.limit) || !this.queryString.limit
        ? this.queryString.limit
          ? +this.queryString.limit * 1
          : 6
        : 6;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const getRestaurants = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const features = new APIfeatures(Restaurants.find(), req.query)
      .filtering()
      .paginating();

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

const createRestaurant = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const { restaurantName, address } = req.body;

    // TODO: Search if restaurant already exists with same name and (addressLine,contact)

    const newRestaurant = new Restaurants({
      name: restaurantName,
      image: '/images/restaurant/domino-sydney.jpg',
      address: {
        addressLine: address.addressLine,
        streetAddress: address.street_address,
        suburb: address.suburb,
        postcode: address.postcode,
        state: address.state,
      },
      cuisine: 'Western',
      contact: 'domino@domino.com',
      category: 'Try Something New',
      deliveryFee: 2.0,
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

    await newRestaurant.save();

    res.json({ success: 'Success! Created a new restaurant' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
