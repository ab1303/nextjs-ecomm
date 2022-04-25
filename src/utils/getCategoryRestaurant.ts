import {
  CategoryDetailsResponse,
  CategoryRestaurants,
} from '@/pages/api/categories/[id]/restaurants';
import { CategoriesResponse } from '@/pages/api/categories/index';
import { getData } from '@/utils/fetchHttpClient';

import { CardData } from '@/types/enum';

export type CategoryRestaurantsDTO = {
  categoryName: string;
  restaurants: CategoryRestaurants;
};

export const getCategoryRestaurants = async (categoriesLimit: number) => {
  const categoriesResponse: CategoriesResponse = await getData(`categories`);

  const categoryRestaurants: CategoryRestaurantsDTO[] = [];

  let i = 1;
  for (const category of categoriesResponse.categories) {
    const res: CategoryDetailsResponse = await getData(
      `categories/${category._id}/restaurants?limit=10`
    );

    if (res.restaurants.length > 0) {
      const categoryRestaurant: CategoryRestaurantsDTO = {
        categoryName: category.name,
        restaurants: res.restaurants,
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

export const getCategoryCards = (
  categoryRestaurant: CategoryRestaurantsDTO
) => {
  const cards: CardData[] = [];
  for (const restaurant of categoryRestaurant.restaurants) {
    const card: CardData = {
      title: restaurant.name,
      url: `/restaurants/${restaurant._id}`,
      image: restaurant.image,
    };

    cards.push(card);
  }

  return cards;
};
