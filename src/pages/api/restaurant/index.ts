import mongoose, { Query } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import Categories, { Category } from '@/models/categoriesModel';
import Restaurants, { Restaurant } from '@/models/restaurantModel';
import connectDB from '@/utils/connectDB';

import { CategoryListDTO } from '../categories';

import { Notify, RestaurantFormData } from '@/types';

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

export type RestaurantListDTO = {
  _id: number;
  name: string;
  image: string;
  cuisine: string;
  contact: string;
  address: string;
};

export type RestaurantsResponse = {
  restaurants: Array<RestaurantListDTO>;
};

const getRestaurants = async (
  req: NextApiRequest,
  res: NextApiResponse<RestaurantsResponse | Notify>
) => {
  try {
    const features = new APIfeatures(Restaurants.find(), req.query);

    const restaurants: Restaurant[] = await features.query;
    const categories: Array<Category> = await Categories.find();

    const categoryResult: Array<CategoryListDTO> = categories.map((c) => ({
      _id: c._id,
      name: c.name,
    }));

    const result: Array<RestaurantListDTO> = await Promise.all(
      restaurants.map(async (r) => {
        const categoryIds = r.categories.map((c: { id: string }) => c.id);

        const categories = categoryResult.filter((cr) =>
          categoryIds.find((cid) => cid === cr._id.toString())
        );

        return {
          _id: r._id,
          name: r.name,
          image: r.image,
          cuisine: r.cuisine,
          contact: r.contact,
          address: r.address.addressLine,
          categories: categories,
        };
      })
    );
    res.json({
      restaurants: result,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};

const createRestaurant = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const { restaurantName, cuisine, address } = req.body as RestaurantFormData;

    // TODO: Search if restaurant already exists with same name and (addressLine,contact)

    const newRestaurant = new Restaurants({
      name: restaurantName,
      address: {
        addressLine: address.addressLine,
        streetAddress: address.street_address,
        suburb: address.suburb,
        postcode: address.postcode,
        state: address.state,
      },
      cuisine: cuisine,
      contact: 'domino@domino.com',
      menu: [],
    });

    await newRestaurant.save();

    res.json({ success: 'Success! Created a new restaurant' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
