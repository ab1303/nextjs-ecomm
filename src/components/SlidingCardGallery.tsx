import SlidingCard from '@/components/SlidingCard';

import { CardData } from '@/types/enum';

type SlidingCardGalleryProps = {
  cards: CardData[];
  title: string;
};

const SlidingCardGallery = ({ cards, title }: SlidingCardGalleryProps) => {
  return (
    <div className='w-4/5 mx-auto'>
      <div className='h-10 my-2 text-xl font-bold text-black-500'>{title}</div>
      {<SlidingCard cardData={cards} />}
    </div>
  );
};

export default SlidingCardGallery;
