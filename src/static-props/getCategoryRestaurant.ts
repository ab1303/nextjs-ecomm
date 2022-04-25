import mongoose from 'mongoose';

import Categories, { Category } from '@/models/categoriesModel';
import Restaurants from '@/models/restaurantModel';
import { CategoryRestaurants } from '@/pages/api/categories/[id]/restaurants';
import { CategoryListDTO } from '@/pages/api/categories/index';
import connectDB from '@/utils/connectDB';

connectDB();

export type CategoryRestaurantsDTO = {
  categoryName: string;
  restaurants: CategoryRestaurants;
};

export const getCategoryRestaurants = async (categoriesLimit: number) => {
  const categories: Array<Category> = await Categories.find();
  const mappedCategories: Array<CategoryListDTO> = categories.map((c) => ({
    _id: c._id,
    name: c.name,
  }));

  const categoryRestaurants: CategoryRestaurantsDTO[] = [];

  let i = 1;
  for (const category of mappedCategories) {
    const categoryDetail: Category | null = await Categories.findById(
      category._id
    );

    if (!categoryDetail) continue;

    const restaurantIds = categoryDetail.restaurants.map(
      (r: { id: string }) => r.id
    );

    const restaurants = await Restaurants.find({
      _id: {
        $in: restaurantIds.map((rid) => new mongoose.Types.ObjectId(rid)),
      },
    });

    const mappedRestaurants = restaurants.map((r) => ({
      _id: r._id.toString(),
      name: r.name,
      image: r.image,
      cuisine: r.cuisine,
      contact: r.contact,
      address: r.address.addressLine,
    }));

    if (mappedRestaurants.length > 0) {
      const categoryRestaurant: CategoryRestaurantsDTO = {
        categoryName: category.name,
        restaurants: mappedRestaurants,
      };

      categoryRestaurants.push(categoryRestaurant);
    }

    if (i == categoriesLimit) {
      break;
    }

    i++;
  }

  return categoryRestaurants;
};
