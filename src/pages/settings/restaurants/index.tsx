import { GetServerSidePropsContext } from 'next';
import { ReactElement, useState } from 'react';
import React from 'react';
import { CellProps, Column, useRowSelect, useTable } from 'react-table';

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
  const [rowIndex, setRowIndex] = useState<number | null>(null);

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
    ],
    []
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
      <div>
        <div className='h-20'></div>
        <h2 className='text-center text-3xl font-extrabold text-gray-900'>
          Restaurant(s)
        </h2>
      </div>
      <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
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
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  // TODO: Later SSR

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
