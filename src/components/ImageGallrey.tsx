import ImageCard from './ImageCard';

import { Photo } from '@/types';

const ImageGallery = () => {
  const images: Photo[] = [
    { filename: 'burger-hood', url: '/images/restaurants/burger-hood.jpg' },
    {
      filename: 'darling-kebabs',
      url: '/images/restaurants/darling-kebabs.jpg',
    },
    { filename: 'domino-sydney', url: '/images/restaurants/domino-sydney.jpg' },
    {
      filename: 'its-time-for-thai-haymarket',
      url: '/images/restaurants/its-time-for-thai-haymarket.jpg',
    },
    {
      filename: 'metro-pita-kebab-ultimo',
      url: '/images/restaurants/metro-pita-kebab-ultimo.jpg',
    },
    {
      filename: 'newstar-takeaway',
      url: '/images/restaurants/newstar-takeaway.jpg',
    },
    {
      filename: 'thai-tharee-darlinghurst',
      url: '/images/restaurants/thai-tharee-darlinghurst.jpeg',
    },
    {
      filename: 'the-pharaoh-bbq',
      url: '/images/restaurants/the-pharaoh-bbq.jpg',
    },
    {
      filename: 'una-restaurant-darlinghurst',
      url: '/images/restaurants/una-restaurant-darlinghurst.jpg',
    },
  ];

  return (
    <div className='w-4/5 mx-auto'>
      <div className='font-bold text-black-500 text-xl my-2 h-10'>
        Restaurants near you
      </div>
      <div className='grid grid-cols-3 gap-4'>
        {images.map((image) => (
          <ImageCard key={image.filename} photo={image} />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
