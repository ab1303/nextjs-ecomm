import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

import auth from '@/middleware/auth';
import Restaurants, { Restaurant } from '@/models/restaurantModel';
import Wishlist from '@/models/wishlistModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';

connectDB();

export default async function handleWishlistRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getUserWishlist(req, res);
      break;
    case 'POST':
      await updateUserWishlist(req, res);
      break;
  }
}

export type FavRestaurantListDTO = {
  restaurantName: string;
  image: string;
};

const getUserWishlist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //const user = await auth(req, res);
    const id = new mongoose.Types.ObjectId('61fc77437e2160ed86314082');

    const userWishList = await Wishlist.findOne({
      userId: '61ea28db76a6bc9d7f9028ba',
    });

    if (!userWishList)
      return res
        .status(400)
        .json({ error: 'No favourites added for the user.' });

    const favRestaurants: Restaurant[] = [];
    userWishList.restaurants.forEach(async function (rId: any) {
      const query: any = { _id: new mongoose.Types.ObjectId(rId) };

      const restaurant = await Restaurants.findOne(query);
      console.log(rId);
      console.log(query);
      console.log(restaurant.name);
      favRestaurants.push(restaurant);
    });

    const result: Array<FavRestaurantListDTO> = favRestaurants.map((w) => ({
      restaurantName: w.name,
      image: w.image,
    }));

    res.json({
      favRestaurants: result,
      count: favRestaurants.length,
    });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};

const updateUserWishlist = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const user = await auth(req, res);
    const { restaurantId } = req.body;

    const userWishList = await Wishlist.findOne({ userId: '' });

    if (userWishList) {
      userWishList.restaurants.push(restaurantId);
      await userWishList.save();
    } else {
      const newWishlist = new Wishlist({
        userId: '',
        restaurants: [restaurantId],
      });

      await newWishlist.save();
    }

    await userWishList.save();
    res.json({ success: 'Wishlist Update Successful!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};
