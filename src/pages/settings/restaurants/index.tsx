import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import React from 'react';
import { CellProps, Column, useRowSelect, useTable } from 'react-table';

import Card from '@/components/card';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import Table from '@/components/table';

import { CategoryListDTO } from '@/pages/api/categories';
import { RestaurantListDTO, RestaurantsResponse } from '@/pages/api/restaurant';
import { getData } from '@/utils/fetchHttpClient';

// import CategoriesModal from '@/features/restaurant/CategoriesModal';
const CategoriesModal = dynamic(
  () => import('@/features/restaurant/CategoriesModal')
);

type RestaurantsPageProps = {
  restaurants: Array<RestaurantListDTO>;
};

export default function RestaurantsPage({ restaurants }: RestaurantsPageProps) {
  const router = useRouter();

  const [tableData, setTableData] =
    useState<Array<RestaurantListDTO>>(restaurants);

  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    categories: Array<CategoryListDTO>;
    id: string | null;
  }>({ id: null, categories: [] });

  const columns = React.useMemo<Column<RestaurantListDTO>[]>(
    () => [
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
        accessor: 'address',
      },
      {
        Header: 'Cuisine',
        accessor: 'cuisine',
      },
      {
        Header: 'Contact #',
        accessor: 'contact',
      },
      {
        Header: 'Categories',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }: CellProps<RestaurantListDTO>) => {
          const { original } = row;

          return (
            <div className='flex flex-row content-around justify-between px-4 '>
              {original.categories.length}

              {original.categories.length > 0 && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 cursor-pointer'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  onClick={() => {
                    setSelectedRestaurant({
                      categories: original.categories,
                      id: original._id,
                    });
                  }}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
              )}
            </div>
          );
        },
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
              onClick={() =>
                router.push(`/settings/restaurants/edit/${original._id}`)
              }
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
          );
        },
      },
    ],
    [router]
  );

  const hooks = [useRowSelect];
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<RestaurantListDTO>(
      {
        columns,
        data: tableData,
      },
      ...hooks
    );

  const handleCategoriesModalClose = (
    updatedCategories: Array<CategoryListDTO>
  ) => {
    // update selected Restaurant Categories
    const restaurantToUpdate = restaurants.find(
      (r) => r._id === selectedRestaurant.id
    );

    if (!restaurantToUpdate) {
      // Should not happen
      throw 'should not happen';
    }

    restaurantToUpdate.categories = [...updatedCategories];

    const updatedTableData = tableData.map((td) => {
      return td._id === selectedRestaurant.id ? restaurantToUpdate : td;
    });

    setTableData(updatedTableData);

    setSelectedRestaurant({
      categories: [],
      id: null,
    });
  };

  return (
    /* eslint-disable react/jsx-key */
    <div className='container min-w-full mx-auto'>
      <Card>
        <Card.Header>
          <div className='flex justify-between text-left'>
            <Card.Header.Title>
              Restaurants - Total ({tableData.length || ''})
            </Card.Header.Title>
            <button
              type='button'
              className='inline-block px-4 py-2.5 bg-gray-200 text-gray-700 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out'
              onClick={() => router.push(`/settings/restaurants/create`)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </button>
          </div>
        </Card.Header>

        <Card.Body>
          <CategoriesModal
            selectedRestaurantId={selectedRestaurant.id}
            restaurantCategories={selectedRestaurant.categories}
            onClose={handleCategoriesModalClose}
          />
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
      </Card>
    </div>
  );
}

export async function getServerSideProps() {
  // TODO: Later Pagination

  // const page = query.page || 1;
  // const category = query.category || 'all';
  // const sort = query.sort || '';
  // const search = query.search || 'all';

  const response: RestaurantsResponse = await getData(`restaurant`);

  // server side rendering
  return {
    props: {
      restaurants: response.restaurants,
    }, // will be passed to the page component as props
  };
}

RestaurantsPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
