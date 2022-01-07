import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      console.log('Passwords do not match!');
      return;
    }

    console.log('call registration');
  };

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
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600 max-w'>
            Already registered? &nbsp;
            <a
              href='#'
              className='font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500'
            >
              Sign in
            </a>
          </p>
        </div>

        <div className='mt-8'>
          <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
            <form className='mb-0 space-y-6' action='#' method='POST'>
              <div>
                <label
                  htmlFor='firstname'
                  className='block text-sm font-medium text-gray-700'
                >
                  First Name
                </label>
                <div className='mt-1'>
                  <input
                    id='firstname'
                    name='firstname'
                    type='text'
                    autoComplete='text'
                    required
                    className=''
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='lastname'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last Name
                </label>
                <div className='mt-1'>
                  <input
                    id='lastname'
                    name='lastname'
                    type='text'
                    autoComplete='text'
                    required
                    className=''
                  />
                </div>
              </div>

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

              <div className='flex items-center'>
                <input
                  id='terms-and-privacy'
                  name='terms-and-privacy'
                  type='checkbox'
                  className=''
                />
                <label
                  htmlFor='terms-and-privacy'
                  className='ml-2 block text-sm text-gray-900'
                >
                  I agree to the &nbsp;
                  <a href='#' className='text-orange-600 hover:text-orange-500'>
                    Terms &nbsp;
                  </a>
                  and &nbsp;
                  <a href='#' className='text-orange-600 hover:text-orange-500'>
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <div>
                <button
                  type='submit'
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
