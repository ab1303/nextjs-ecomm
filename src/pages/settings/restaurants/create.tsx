import clsx from 'clsx';
import { ReactElement, useState } from 'react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

// TODO: This is going to be a SSR page with list of restaurants

type RestaurantFormData = {
  restaurant: string;
  address: string;
  city: string;
  state: string;
};

export default function RestaurantsPage() {
  const formMethods = useForm<RestaurantFormData>({
    mode: 'onBlur',
    defaultValues: {
      restaurant: '',
      address: '',
      city: '',
      state: '',
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submitHandler = (formData: RestaurantFormData) => {
    console.log('Restaurant Form Data:', JSON.stringify(formData, null, 2));
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col px-6 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <div className='mx-auto w-3/4'>
          <div>
            <div className='h-20'></div>
            <h2 className='text-center text-3xl font-extrabold text-gray-900'>
              New Restaurant
            </h2>
          </div>

          <div className='grid grid-cols-4 gap-4 bg-gray-400'>
            <div className='col-span-1 border-2'></div>
            <div className='col-span-3 border-2 bg-white mt-8 py-8 px-6 shadow rounded-lg sm:px-10'>
              <FormProvider {...formMethods}>
                <form
                  className='mb-0 space-y-6'
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div>
                    <label
                      className={clsx(
                        'block text-sm font-medium ',
                        errors.restaurant ? 'text-orange-700' : 'text-gray-700'
                      )}
                    >
                      Name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        className={clsx(
                          errors.restaurant &&
                            'text-orange-700 border-orange-700'
                        )}
                        {...register('restaurant', { required: true })}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor='address'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Address
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        className={clsx(
                          errors.address && 'text-orange-700 border-orange-700'
                        )}
                        {...register('address', { required: true })}
                      />
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='w-1/2'>
                      <label
                        htmlFor='city'
                        className='block text-sm font-medium text-gray-700'
                      >
                        City
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          id='city'
                          className={clsx(
                            errors.city && 'text-orange-700 border-orange-700'
                          )}
                          {...register('city', { required: true })}
                        />
                      </div>
                    </div>

                    <div className='w-1/2 ml-3'>
                      <label
                        htmlFor='state'
                        className='block text-sm font-medium text-gray-700'
                      >
                        State
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          className={clsx(
                            errors.state && 'text-orange-700 border-orange-700'
                          )}
                          {...register('state', { required: true })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type='submit'
                      className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                    >
                      Create
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RestaurantsPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
