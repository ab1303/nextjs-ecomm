import Image from 'next/image';
import Link from 'next/link';

import { CardData } from '@/types/enum';
interface SlidingCardsProps {
  cardData: CardData[];
}
const SlidingCards = (props: SlidingCardsProps) => {
  const getCardsLayout = () => {
    return props.cardData.map((card) => {
      return (
        <Link key={card.title} href={card.url} passHref>
          <div className='flex-none w-1/4 mr-8 border rounded-lg md:w-1/3 md:pb-4'>
            <div className='max-w-sm overflow-hidden rounded shadow-lg'>
              <div className='relative h-64 w-96'>
                <Image
                  layout='fill'
                  objectFit='cover'
                  src={card.image}
                  alt=''
                />
              </div>

              <div className='px-6 py-4'>
                <div className='mb-2 text-lg font-bold text-gray-500'>
                  {card.title}
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  return (
    <div className='mx-4 my-8 '>
      <div
        id='scrollContainer'
        className='flex flex-no-wrap items-start overflow-hidden scrolling-touch hover:overflow-x-auto'
      >
        {getCardsLayout()}
      </div>
    </div>
  );
};

export default SlidingCards;
