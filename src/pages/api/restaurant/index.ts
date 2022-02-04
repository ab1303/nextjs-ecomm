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
      image: '/images/restaurants/domino-sydney.jpg',
      address: 'North Sydney',
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
    await newRestaurant1.save();

    const newRestaurant2 = new Restaurants({
      name: 'Darling Kebabs',
      image: '/images/restaurants/darling-kebabs.jpg',
      address: 'Sydney',
      cuisine: 'Middle Eastern',
      contact: 'kebabs@kebab.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
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

    const newRestaurant3 = new Restaurants({
      name: 'Burger Hood',
      image: '/images/restaurants/burger-hood.jpg',
      address: 'Sydney Central',
      cuisine: 'Western',
      contact: 'burger@burgers.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
      menu: [
        {
          title: 'Burger',
          image: 'burger.jpg',
          description: 'Beef Burger',
          category: 'Lunch',
          price: 40,
        },
      ],
    });
    await newRestaurant3.save();

    const newRestaurant4 = new Restaurants({
      name: 'Thai Tharee',
      image: '/images/restaurants/thai-tharee-darlinghurst.jpg',
      address: 'Sydney Darlinghurst',
      cuisine: 'Asian',
      contact: 'thai@tharee.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
      menu: [
        {
          title: 'Curry Rice',
          image: 'curry.jpg',
          description: 'Green Curry',
          category: 'Lunch',
          price: 30,
        },
      ],
    });
    await newRestaurant4.save();

    const newRestaurant5 = new Restaurants({
      name: 'Its Time For Thai',
      image: '/images/restaurants/its-time-for-thai-haymarket.jpg',
      address: 'Sydney Haymarket',
      cuisine: 'Asian',
      contact: 'thai@itstime.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
      menu: [
        {
          title: 'Curry Rice',
          image: 'curry.jpg',
          description: 'Red Curry',
          category: 'Lunch',
          price: 30,
        },
      ],
    });
    await newRestaurant5.save();

    const newRestaurant6 = new Restaurants({
      name: 'Metro Pita Kebab Ultimo',
      image: '/images/restaurants/metro-pita-kebab-ultimo.jpg',
      address: 'Sydney',
      cuisine: 'Middle Eastern',
      contact: 'pita@kebab.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
      menu: [
        {
          title: 'Kebab',
          image: 'kebab.jpg',
          description: 'Mutton Kebab',
          category: 'Lunch',
          price: 60,
        },
      ],
    });
    await newRestaurant6.save();

    const newRestaurant7 = new Restaurants({
      name: 'Newstar Takeaway',
      image: '/images/restaurants/newstar-takeaway.jpg',
      address: 'Sydney',
      cuisine: 'Western',
      contact: 'star@takeaway.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
      menu: [
        {
          title: 'Toast',
          image: 'toast.jpg',
          description: 'Cheese Toast',
          category: 'Breakfast',
          price: 15,
        },
      ],
    });
    await newRestaurant7.save();

    const newRestaurant8 = new Restaurants({
      name: 'The Pharaoh Bbq',
      image: '/images/restaurants/the-pharaoh-bbq.jpg',
      address: 'Sydney',
      cuisine: 'Middle Eastern',
      contact: 'pita@kebab.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
      menu: [
        {
          title: 'Bbq Platter',
          image: 'bbq.jpg',
          description: 'Grilled Beef',
          category: 'Dinner',
          price: 70,
        },
      ],
    });
    await newRestaurant8.save();

    const newRestaurant9 = new Restaurants({
      name: 'Una Restaurant',
      image: '/images/restaurants/una-restaurant-darlinghurst.jpg',
      address: 'Sydney Darlinghurst',
      cuisine: 'Asian',
      contact: 'una@restaurant.com',
      category: 'Try Something New',
      deliveryFee: 1.5,
      menu: [
        {
          title: 'Noodles',
          image: 'noodles.jpg',
          description: 'Chicken Noodles',
          category: 'Lunch',
          price: 35,
        },
      ],
    });
    await newRestaurant9.save();

    res.json({ msg: 'Success! created a new restaurants' });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};
