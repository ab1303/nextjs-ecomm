import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import React from 'react';
import { CellProps, Column, useRowSelect, useTable } from 'react-table';

import Card from '@/components/card';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import Table from '@/components/table';

import { RestaurantsResponse } from '@/pages/api/restaurant';
import { getData } from '@/utils/fetchHttpClient';

import { RestaurantDTO } from '@/types';

// TODO: This is going to be a SSR page with list of restaurants

type RestaurantsPageProps = {
  restaurants: Array<RestaurantDTO>;
};

export default function RestaurantsPage({ restaurants }: RestaurantsPageProps) {
  const router = useRouter();

  const columns = React.useMemo<Column<RestaurantDTO>[]>(
    () => [
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
        Cell: ({ row }: CellProps<RestaurantDTO>) => {
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
    useTable<RestaurantDTO>(
      {
        columns,
        data: restaurants,
      },
      ...hooks
    );

  return (
    /* eslint-disable react/jsx-key */
    <div className='container min-w-full mx-auto'>
      <Card>
        <Card.Header>
          <div className='justify-between text-left'>
            <Card.Header.Title>
              Restaurants - Total ({restaurants.length || ''})
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
    </div>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
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
