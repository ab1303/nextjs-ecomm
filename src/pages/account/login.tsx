import Image from 'next/image';
import { FormEvent, useState } from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

const Login = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <div>
          <div className='w-21 h-20 mx-auto relative '>
            <Image
              layout='fill'
              objectFit='contain'
              src='/images/logo.png'
              alt='Workflow'
            />
          </div>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>
            Sign in
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600 max-w'>
            New to Food App? &nbsp;
            <UnstyledLink
              href='/account/register'
              className='font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500'
            >
              Sign up
            </UnstyledLink>
          </p>
        </div>

        <div className='mt-8'>
          <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
            <form className='mb-0 space-y-6' action='#' method='POST'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email address
                </label>
                <div className='mt-1'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className=''
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    className=''
                  />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
