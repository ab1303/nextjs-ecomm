import { Restaurant } from '@/models/restaurantModel';

import ImageCard from './ImageCard';

import { Photo } from '@/types';

type RestaurantList = {
  restaurants: Restaurant[];
  category: string;
};

const ImageGallery = ({ restaurants, category }: RestaurantList) => {
  const restaurantImages: any[] = [];
  restaurants.map((restaurant) => {
    const image: Photo = {
      filename: restaurant.name,
      url: restaurant.image,
    };

    restaurantImages.push(
      <ImageCard
        key={restaurant.name}
        photo={image}
        deliveryFee={restaurant.deliveryFee}
      />
    );
  });

  return (
    <div className='w-4/5 mx-auto'>
      <div className='h-10 my-2 text-xl font-bold text-black-500'>
        {category}
      </div>
      <div className='grid grid-cols-3 gap-4'>{restaurantImages}</div>
    </div>
  );
};

export default ImageGallery;
