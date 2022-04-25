import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { CardData } from '@/types/enum';
interface SlidingCardsProps {
  cardData: CardData[];
}
const SlidingCards = (props: SlidingCardsProps) => {
  const scrollDiv = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollDiv.current) scrollDiv.current.scrollLeft -= 120;
  };
  const scrollRight = () => {
    if (scrollDiv.current) scrollDiv.current.scrollLeft += 120;
  };
  const getCardsLayout = () => {
    return props.cardData.map((card) => {
      return (
        <Link key={card.title} href={card.url} passHref>
          <div className='flex-none w-1/4 mr-8 border rounded-lg md:w-1/3 md:pb-4 cursor-pointer'>
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
    <div className='my-8'>
      <div
        id='scrollContainer'
        ref={scrollDiv}
        className='flex flex-no-wrap items-start overflow-hidden scrolling-touch'
      >
        {getCardsLayout()}
        <button
          onClick={scrollLeft}
          className='absolute flex items-center justify-start w-10 h-64 p-0 text-center border-0 top--64 carousel-control-prev hover:outline-none hover:no-underline focus:outline-none focus:no-underline'
          type='button'
          data-bs-target='#carouselExampleCaptions'
          data-bs-slide='prev'
        >
          <span
            className='inline-block bg-no-repeat carousel-control-prev-icon'
            aria-hidden='true'
          ></span>
          <span className='visually-hidden'>Previous</span>
        </button>
        <button
          onClick={scrollRight}
          className='absolute flex items-center justify-end w-10 h-64 p-0 text-center border-0 right-48 top--64 carousel-control-next hover:outline-none hover:no-underline focus:outline-none focus:no-underline'
          type='button'
          data-bs-target='#carouselExampleCaptions'
          data-bs-slide='next'
        >
          <span
            className='inline-block bg-no-repeat carousel-control-next-icon'
            aria-hidden='true'
          ></span>
          <span className='visually-hidden'>Next</span>
        </button>
      </div>
    </div>
  );
};

export default SlidingCards;
