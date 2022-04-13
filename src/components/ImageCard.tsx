import Image from 'next/image';

import { Photo } from '@/types';

type ImageCardProps = {
  photo: Photo;
  deliveryFee: number;
};

const ImageCard = ({ photo }: ImageCardProps) => {
  return (
    <div className='max-w-sm overflow-hidden rounded shadow-lg'>
      <div className='relative h-64 w-96'>
        <Image
          layout='fill'
          objectFit='cover'
          src={photo.url}
          alt={photo.filename}
        />
      </div>

      <div className='px-6 py-4'>
        <div className='mb-2 text-lg font-bold text-gray-500'>
          {photo.filename}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
