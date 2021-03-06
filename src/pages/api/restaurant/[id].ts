import { NextApiRequest, NextApiResponse } from 'next';

import {
  addressModelToAddressMap,
  addressToAddressModelMap,
} from '@/mappers/addressMapper';
import Restaurants, { Restaurant } from '@/models/restaurantModel';
import Users from '@/models/userModel';
import Wishlist from '@/models/wishlistModel';
import connectDB from '@/utils/connectDB';

import { Address, EditRestaurantFormData, Notify } from '@/types';

connectDB();

export default async function handleRestaurantRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getRestaurant(req, res);
      break;
    case 'PUT':
      await updateRestaurant(req, res);
      break;
  }
}

export type GetRestaurantDTO = {
  _id: string;
  name: string;
  image: string;
  thumbnail: string;
  cuisine: string;
  contact: string;
  address: Address;
};

export type GetRestaurantResponse = {
  restaurant: GetRestaurantDTO;
  isFavorite: boolean;
};

const getRestaurant = async (
  req: NextApiRequest,
  res: NextApiResponse<GetRestaurantResponse | Notify>
) => {
  try {
    const { id, userEmail } = req.query;

    let isFavorite = false;
    const user = await Users.findOne({ email: userEmail });
    if (user) {
      const userWishList = await Wishlist.findOne({
        userId: user.id,
      });

      if (userWishList) {
        isFavorite = !!userWishList.restaurants.find(
          (r: { id: string }) => r.id === id
        );
      }
    }

    const restaurant: Restaurant | null = await Restaurants.findById(id);
    if (!restaurant)
      return res.status(422).json({ error: 'This restaurant does not exist.' });

    res.json({
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        image: restaurant.image,
        thumbnail: restaurant.thumbnail,
        cuisine: restaurant.cuisine,
        contact: restaurant.contact,
        address: addressModelToAddressMap(restaurant.address),
      },
      isFavorite,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const updateRestaurant = async (
  req: NextApiRequest,
  res: NextApiResponse<Notify>
) => {
  try {
    const {
      restaurantName,
      imageUrl,
      thumbnailUrl,
      cuisine,
      contact,
      address,
    } = req.body as EditRestaurantFormData;

    const { id } = req.query;
    const restaurant: Restaurant | null = await Restaurants.findById(id);
    if (!restaurant)
      return res.status(422).json({ error: 'This restaurant does not exist.' });

    await Restaurants.findByIdAndUpdate(
      { _id: id },
      {
        name: restaurantName,
        cuisine,
        image: imageUrl,
        thumbnail: thumbnailUrl,
        contact: contact,
        address: addressToAddressModelMap(address),
      }
    );

    res.status(200).json({ success: 'Restaurant updated succesfully!' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
