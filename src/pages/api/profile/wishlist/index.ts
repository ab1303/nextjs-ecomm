import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import Restaurants, { Restaurant } from '@/models/restaurantModel';
import Users from '@/models/userModel';
import Wishlist from '@/models/wishlistModel';
import connectDB from '@/utils/connectDB';

import { RestaurantListDTO } from '../../restaurant';

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

export type FavRestaurantListDTO = Omit<RestaurantListDTO, 'categories'>;

const getUserWishlist = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userEmail } = req.query;
    const user = await Users.findOne({ email: userEmail });

    const userWishList = await Wishlist.findOne({
      userId: user.id,
    });

    if (!userWishList) {
      res.json({
        restaurants: [],
      });
      return;
    }

    const favRestaurants: Restaurant[] = [];
    for (const restaurantItem of userWishList.restaurants) {
      const restaurant = await Restaurants.findOne({ _id: restaurantItem.id });
      favRestaurants.push(restaurant);
    }

    const result: Array<FavRestaurantListDTO> = favRestaurants.map((r) => ({
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
    return res.status(500).json({ err: err.message });
  }
};

const updateUserWishlist = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const { restaurantId, link } = req.body;
    const user = await getUser(req);

    if (!user) {
      res.status(400).json({ error: 'Authentication is not valid.' });
    }

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

      return;
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

const getUser = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  if (!session) return null;

  const user = await Users.findOne({ email: session.user.email });
  return user;
};
