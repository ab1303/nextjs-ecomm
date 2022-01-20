import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

import { postData } from '@/utils/fetchData';

const Register = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      //TODO toastify
      alert('password does not match confirm password');
      return;
    }

    const res = await postData('auth/register', {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    alert(res.msg);
    router.push('/auth/login');
    //TODO toastify on error
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
            <UnstyledLink
              href='/auth/login'
              className='font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500'
            >
              Sign in
            </UnstyledLink>
          </p>
        </div>

        <div className='mt-8'>
          <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
            <form className='mb-0 space-y-6' onSubmit={handleSubmit}>
              <div className='flex'>
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
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div className='ml-3'>
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
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='passwordConfirm'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm Password
                </label>
                <div className='mt-1'>
                  <input
                    id='passwordConfirm'
                    name='passwordConfirm'
                    type='password'
                    autoComplete='current-password'
                    required
                    className=''
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
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
