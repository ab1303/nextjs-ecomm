import clsx from 'clsx';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

import AddressComponent from '@/features/Address';

import { RestaurantFormData } from '@/types';

type EditRestaurantFormData = RestaurantFormData;

type EditRestaurantPageProps = {
  apiKey: string;
};

export default function EditRestaurantsPage({
  apiKey,
}: EditRestaurantPageProps) {
  const formMethods = useForm<EditRestaurantFormData>({
    mode: 'onBlur',
    defaultValues: {
      restaurant: '',
      address: {
        addressLine: '',
        street_address: '',
        suburb: '',
        postcode: '',
        state: '',
      },
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submitHandler = (formData: EditRestaurantFormData) => {
    console.log('Restaurant Form Data:', JSON.stringify(formData, null, 2));
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col px-6 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <div className='mx-auto w-3/4'>
          <div>
            <div className='h-20'></div>
            <h2 className='text-center text-3xl font-extrabold text-gray-900'>
              Edit Restaurant
            </h2>
          </div>

          <div className='grid grid-cols-6 gap-4 bg-gray-400'>
            <div className='col-span-1 border-2'></div>
            <div className='col-span-4 border-2 bg-white mt-8 py-8 px-6 shadow rounded-lg sm:px-10'>
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

                  <AddressComponent apiKey={apiKey} />

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
            <div className='col-span-1 border-2'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // server side rendering
  return {
    props: {
      apiKey: process.env.GOOGLE_API_KEY!,
    },
  };
}

EditRestaurantsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
