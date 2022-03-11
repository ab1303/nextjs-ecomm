import Select from 'react-select';

import Card from '@/components/card';

type CategoryDetailsProps = {
  handleCategoryDeSelect: () => void;
};

export default function CategoryDetails({
  handleCategoryDeSelect,
}: CategoryDetailsProps) {
  const restaurantsList = [
    {
      _id: 1,
      name: 'First Restaurant',
    },
    {
      _id: 2,
      name: 'Second Restaurant',
    },
    {
      _id: 3,
      name: 'Third Restaurant',
    },
    {
      _id: 4,
      name: 'Four Restaurant',
    },
    {
      _id: 5,
      name: 'Five Restaurant',
    },
    {
      _id: 6,
      name: 'Six Restaurant',
    },
    {
      _id: 7,
      name: 'Seven Restaurant',
    },
  ];
  return (
    <div className='mx-auto'>
      <Card.Header>
        <div className='mt-4 text-left flex flex-row justify-between'>
          <Card.Header.Title>Linked Restaurants</Card.Header.Title>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 cursor-pointer'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
            onClick={handleCategoryDeSelect}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </div>
      </Card.Header>
      <div className='bg-white h-96 shadow mt-4 px-6 sm:px-10 container min-w-full'>
        <div className='flex justify-center items-center py-6'>
          <Select
            className='w-3/5 mr-2'
            options={Object.keys(restaurantsList).map((k) => ({
              label: k,
            }))}
          />

          <button className='py-1 px-1 ml-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 cursor-pointer'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
              // onClick={handleCategoryDeSelect}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 4v16m8-8H4'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
