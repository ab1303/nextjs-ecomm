import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import React from 'react';
import { CellProps, Column, useRowSelect, useTable } from 'react-table';
import { toast } from 'react-toastify';

import Card from '@/components/card';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import Table from '@/components/table';

import { UserDTO, UsersResponse } from '@/pages/api/users';
import { deleteData, getData, patchData } from '@/utils/fetchHttpClient';

import { Notify } from '@/types';

type UsersPageProps = {
  users: Array<UserDTO>;
};

export default function UsersPage({ users }: UsersPageProps) {
  const router = useRouter();

  const deleteHandler = async (user: UserDTO) => {
    try {
      const result: { ok: boolean } & Notify = await deleteData(
        `users\\${user._id}`,
        ''
      );

      if (!result.ok) toast.error(result.error);

      if (result.ok) toast.success(result.success || 'User deleted!');

      router.replace('/settings/users');
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  const statusHandler = async (user: UserDTO) => {
    try {
      const result: { ok: boolean } & Notify = await patchData(
        `users\\${user._id}`,
        {},
        ''
      );

      if (!result.ok) toast.error(result.error);

      if (result.ok) toast.success(result.success || 'User updated!');

      router.replace('/settings/users');
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  const columns = React.useMemo<Column<UserDTO>[]>(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstname',
      },
      {
        Header: 'Last Name',
        accessor: 'lastname',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Active',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }: CellProps<UserDTO>) => {
          const { original } = row;

          return (
            <div className='flex w-full items-left justify-left'>
              <label className='flex items-center cursor-pointer'>
                <div className='relative'>
                  <input
                    type='checkbox'
                    className='sr-only'
                    checked={original.active}
                    onChange={() => statusHandler(original)}
                  />
                  <div className='w-10 h-4 bg-gray-400 rounded-full shadow-inner'></div>
                  <div className='absolute w-6 h-6 transition bg-white rounded-full shadow dot -left-1 -top-1'></div>
                </div>
              </label>
            </div>
          );
        },
      },
      {
        Header: 'Delete',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }: CellProps<UserDTO>) => {
          const { original } = row;

          return (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-6 h-6 cursor-pointer'
              viewBox='0 0 24 24'
              fill='currentColor'
              onClick={() => deleteHandler(original)}
            >
              <path
                fillRule='evenodd'
                d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                clipRule='evenodd'
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
    useTable<UserDTO>(
      {
        columns,
        data: users,
      },
      ...hooks
    );

  return (
    /* eslint-disable react/jsx-key */
    <div className='container min-w-full mx-auto'>
      <Card>
        <Card.Header>
          <div className='flex justify-between text-left'>
            <Card.Header.Title>
              Users - ({users.length || ''})
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

export async function getServerSideProps() {
  const response: UsersResponse = await getData(`users`);
  // server side rendering
  return {
    props: {
      users: response.users,
    }, // will be passed to the page component as props
  };
}

UsersPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
