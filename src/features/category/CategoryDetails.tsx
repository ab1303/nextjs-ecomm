import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { CellProps, Column, useTable } from 'react-table';
import { toast } from 'react-toastify';

import Card from '@/components/card';
import Table from '@/components/table';

import { CategoryDetailsResponse } from '@/pages/api/categories/[id]/restaurants';
import { RestaurantListDTO } from '@/pages/api/restaurant';
import { getData, putData } from '@/utils/fetchHttpClient';

import { Notify } from '@/types';

type CategoryDetailsProps = {
  restaurants: Array<RestaurantListDTO>;
  selectedCategoryId: number | null;
  handleCategoryDeSelect: () => void;
};

export default function CategoryDetails({
  restaurants,
  selectedCategoryId,
  handleCategoryDeSelect,
}: CategoryDetailsProps) {
  const [restaurantOptions, setRestaurantOptions] =
    useState<Array<RestaurantListDTO>>(restaurants);

  // TODO: set state from received prop later
  const [linkedRestaurants, setLinkedRestaurants] = useState<
    Array<RestaurantListDTO>
  >([]);

  useEffect(() => {
    async function fetchCategoryDetails() {
      const categoryDetailsResult: (CategoryDetailsResponse | Notify) & {
        ok: boolean;
      } = await getData(`categories/${selectedCategoryId}/restaurants`);

      const categoryRestaurants = (
        categoryDetailsResult as CategoryDetailsResponse
      ).restaurants;
      if (categoryRestaurants) setLinkedRestaurants(categoryRestaurants);

      const filteredRestaurantOptions = restaurants.filter(
        (ro) => !categoryRestaurants.find((cr) => cr._id == ro._id)
      );

      setRestaurantOptions(filteredRestaurantOptions);
    }

    fetchCategoryDetails();
  }, [restaurants, selectedCategoryId]);

  const columns = React.useMemo<Column<RestaurantListDTO>[]>(() => {
    const handleUnLinkRestaurant = (id: number) => {
      if (!id) return;

      const restaurantToUnLink = restaurants.find((r) => r._id === id);

      if (!restaurantToUnLink) return;

      // TODO Make api call

      const newLinkedRestaurts = linkedRestaurants.filter((r) => r._id !== id);

      setRestaurantOptions([...restaurantOptions, { ...restaurantToUnLink }]);

      setLinkedRestaurants(newLinkedRestaurts);
    };

    return [
      {
        id: 'thumbnail',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }: CellProps<RestaurantListDTO>) => {
          const { original } = row;

          if (!original.image) return null;

          return (
            <div className='h-20 w-40 relative rounded overflow-hidden shadow-lg'>
              <Image
                layout='fill'
                objectFit='cover'
                src={original.image || ''}
                alt='Image'
              />
            </div>
          );
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Address',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }: CellProps<RestaurantListDTO>) => {
          const { original } = row;

          return <span className='w-10'>{original.address}</span>;
        },
        width: '10px',
      },
      {
        Header: 'Cuisine',
        accessor: 'cuisine',
      },
      {
        Header: 'Action',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }: CellProps<RestaurantListDTO>) => {
          const { original } = row;

          return (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 cursor-pointer'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
              onClick={() => handleUnLinkRestaurant(original._id)}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          );
        },
      },
    ];
  }, [linkedRestaurants, restaurantOptions, restaurants]);

  const [selectedRestaurant, setSelectedRestaurant] = useState<
    | SingleValue<{
        value: number;
        label: string;
      }>
    | undefined
  >();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<RestaurantListDTO>({
      columns,
      data: linkedRestaurants,
    });

  const handleOptionChange = (
    option: SingleValue<{
      value: number;
      label: string;
    }>
  ) => {
    if (!option) {
      setSelectedRestaurant(null);
      return;
    }

    if (option.value) setSelectedRestaurant(option);

    return;
  };

  const handleLinkRestaurant = async () => {
    if (!selectedRestaurant) return;

    const restaurantToLink = restaurantOptions.find(
      (r) => r._id === selectedRestaurant.value
    );

    if (!restaurantToLink) return;

    try {
      const result: { ok: boolean } & Notify = await putData(
        `categories/${selectedCategoryId}/restaurants`,
        {
          restaurantId: selectedRestaurant.value,
        }
      );

      if (!result.ok) toast.error(result.error);

      toast.success(result.success || 'Restaurant linked!');

      const newLinkedRestaurts = [
        ...linkedRestaurants,
        { ...restaurantToLink },
      ];

      setRestaurantOptions(
        restaurantOptions.filter((ro) => ro._id !== restaurantToLink._id)
      );
      setLinkedRestaurants(newLinkedRestaurts);
      setSelectedRestaurant(null);
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  return (
    /* eslint-disable react/jsx-key */
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
      <div className='bg-white h-auto shadow mt-4 px-6 sm:px-10 container min-w-full'>
        <div className='flex justify-center items-center py-6'>
          <Select
            className='w-3/5 mr-2'
            value={selectedRestaurant}
            options={restaurantOptions.map((r) => ({
              value: r._id,
              label: r.name,
            }))}
            isClearable
            onChange={(option) => handleOptionChange(option)}
          />

          <button
            className='py-1 px-1 ml-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            onClick={handleLinkRestaurant}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 cursor-pointer'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
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

      <div className='mt-8 overflow-x-scroll'>
        <Card.Body>
          <Table {...getTableProps()}>
            <Table.THead>
              {headerGroups.map((headerGroup) => (
                <Table.THead.TR {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Table.THead.TH {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </Table.THead.TH>
                  ))}
                </Table.THead.TR>
              ))}
            </Table.THead>
            <Table.TBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <Table.TBody.TR {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <Table.TBody.TD {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </Table.TBody.TD>
                      );
                    })}
                  </Table.TBody.TR>
                );
              })}
            </Table.TBody>
          </Table>
        </Card.Body>
      </div>
    </div>
  );
}
