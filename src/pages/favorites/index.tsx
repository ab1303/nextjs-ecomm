import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { ReactElement, useState } from 'react';
import React from 'react';
import { CellProps, Column, useRowSelect, useTable } from 'react-table';
import { toast } from 'react-toastify';

import Card from '@/components/card';
import FavoriteSwitch from '@/components/FavoriteSwitch';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import Table from '@/components/table';

import { RestaurantListDTO, RestaurantsResponse } from '@/pages/api/restaurant';
import { getData, postData } from '@/utils/fetchHttpClient';

import { Notify } from '@/types';

type RestaurantsPageProps = {
  restaurants: Array<RestaurantListDTO>;
};

export default function RestaurantsPage({ restaurants }: RestaurantsPageProps) {
  const [tableData, setTableData] =
    useState<Array<RestaurantListDTO>>(restaurants);

  const columns = React.useMemo<Column<RestaurantListDTO>[]>(() => {
    const handleRemoveFavorite = async (restaurantId: string) => {
      try {
        const result: { ok: boolean } & Notify = await postData(
          `profile/wishlist`,
          {
            restaurantId,
            link: 'remove',
          }
        );

        if (!result.ok) {
          toast.error(result.error);
          return;
        }

        const updatedFavoriteRestaurants = restaurants.filter(
          (r) => r._id !== restaurantId
        );

        setTableData(updatedFavoriteRestaurants);

        const successMsg = 'Restaurant removed from wishlist !';

        toast.success(result.success || successMsg);
      } catch (e: any) {
        toast.error(e.error);
      }
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
        Header: 'Action',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }: CellProps<RestaurantListDTO>) => {
          const { original } = row;

          return (
            <FavoriteSwitch
              isSelected
              onStateChange={() => handleRemoveFavorite(original._id)}
            />
          );
        },
      },
    ];
  }, [restaurants]);

  const hooks = [useRowSelect];
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<RestaurantListDTO>(
      {
        columns,
        data: tableData,
      },
      ...hooks
    );

  return (
    /* eslint-disable react/jsx-key */
    <div className='container min-w-full mx-auto'>
      {tableData.length > 0 ? (
        <Card>
          <Card.Header>
            <div className='flex justify-between text-left'>
              <Card.Header.Title>
                Favorites - Total ({tableData.length || ''})
              </Card.Header.Title>
            </div>
          </Card.Header>
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
        </Card>
      ) : (
        <div className='text-orange-400 mt-36 text-center text-lg font-bold'>
          {' '}
          No restaurant added to favorite list !
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session == null) {
    throw new Error('Unexpected session null');
  }

  const response: RestaurantsResponse = await getData(
    `profile/wishlist?userEmail=${session.user.email}`
  );

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
