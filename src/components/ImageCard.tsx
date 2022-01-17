import Image from 'next/image';

import { Photo } from '@/types';

type ImageCardProps = {
  photo: Photo;
};

const ImageCard = ({ photo }: ImageCardProps) => {
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg'>
      <div className='h-64 w-96 relative'>
        <Image
          layout='fill'
          objectFit='cover'
          src={photo.url}
          alt={photo.filename}
        />
      </div>

      <div className='px-6 py-4'>
        <div className='font-bold text-gray-500 text-lg mb-2'>
          {photo.filename}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
