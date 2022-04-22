import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import Restaurants, { Restaurant } from '@/models/restaurantModel';
import Users from '@/models/userModel';
import Wishlist from '@/models/wishlistModel';
import connectDB from '@/utils/connectDB';

import { Notify } from '@/types';
import { FavoriteLink } from '@/types/enum';

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
    const user = await getUser(req, res);
    const userWishList = await Wishlist.findOne({
      userId: user.id,
    });

    if (!userWishList)
      return res
        .status(400)
        .json({ error: 'No favourites added for the user.' });

    const favRestaurants: Restaurant[] = [];
    for (const resId of userWishList.restaurants) {
      const restaurant = await Restaurants.findOne({ _id: resId });
      favRestaurants.push(restaurant);
    }

    const result: Array<FavRestaurantListDTO> = favRestaurants.map((w) => ({
      restaurantName: w.name,
      image: w.image,
    }));

    res.json({
      favRestaurants: result,
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
    const { restaurantId, link } = req.body;
    const user = await getUser(req, res);

    const userWishList = await Wishlist.findOne({
      userId: user.id,
    });

    if (userWishList && restaurantId) {
      switch (link as FavoriteLink) {
        case 'add':
          if (
            !userWishList.restaurants.find(
              (r: { id: string }) => r.id === restaurantId
            )
          ) {
            userWishList.restaurants.push({ id: restaurantId });
            await userWishList.save();
          }

          res.json({
            success: 'Success! selected restaurant added to wishlist',
          });

          break;

        case 'remove':
          await Wishlist.updateOne(
            { _id: userWishList._id },
            { $pull: { restaurants: { id: restaurantId } } },
            { safe: true, multi: false }
          );

          res.json({
            success: 'Success! selected restaurant removed from wishlist',
          });

          break;
      }
    }

    const newWishlist = new Wishlist({
      userId: user.id,
      restaurants: [{ id: restaurantId }],
    });
    await newWishlist.save();

    res.json({
      success: 'Success! selected restaurant added to wishlist',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err });
  }
};

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session)
    return res.status(400).json({ error: 'Authentication is not valid.' });

  const user = await Users.findOne({ email: session.user.email });
  return user;
};
