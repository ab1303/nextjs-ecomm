import clsx from 'clsx';
import { ReactElement } from 'react';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';

import Card from '@/components/card';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

import AddressComponent from '@/features/Address';
import { postData } from '@/utils/fetchHttpClient';

import { Notify, RestaurantFormData } from '@/types';
import { CuisineMap } from '@/types/maps';

type CreateRestaurantFormData = RestaurantFormData;

type CreateRestaurantPageProps = {
  apiKey: string;
};

export default function CreateRestaurantPage({
  apiKey,
}: CreateRestaurantPageProps) {
  const formMethods = useForm<CreateRestaurantFormData>({
    mode: 'onBlur',
    defaultValues: {
      restaurantName: '',
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
    control,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submitHandler = async (formData: RestaurantFormData) => {
    try {
      const result: { ok: boolean } & Notify = await postData('restaurant', {
        restaurantName: formData.restaurantName,
        cuisine: formData.cuisine,
        address: formData.address,
      });

      if (!result.ok) toast.error(result.error);

      toast.success(result.success || 'Restaurant created!');
      // router.replace('/settings/restaurants');
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col px-6 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <div className='mx-auto w-3/4'>
          <Card.Header>
            <div className='flex justify-between mt-4  text-left'>
              <Card.Header.Title>New Restaurant</Card.Header.Title>
            </div>
          </Card.Header>

          <div className='bg-white shadow mt-4 py-8 px-6 sm:px-10'>
            <FormProvider {...formMethods}>
              <form
                className='mb-0 space-y-6'
                onSubmit={handleSubmit(submitHandler)}
              >
                <div>
                  <label
                    className={clsx(
                      'block text-sm font-medium ',
                      errors.restaurantName
                        ? 'text-orange-700'
                        : 'text-gray-700'
                    )}
                  >
                    Name
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      className={clsx(
                        errors.restaurantName &&
                          'text-orange-700 border-orange-700'
                      )}
                      {...register('restaurantName', { required: true })}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={clsx(
                      'block text-sm font-medium ',
                      errors.restaurantName
                        ? 'text-orange-700'
                        : 'text-gray-700'
                    )}
                  >
                    Cuisine
                  </label>
                  <div className='mt-1'>
                    <Controller
                      name='cuisine'
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor:
                                errors.cuisine && 'rgba(194, 65, 12)',
                            }),
                          }}
                          value={{ label: value }}
                          options={Object.keys(CuisineMap).map((k) => ({
                            label: k,
                          }))}
                          getOptionValue={({ label }) => label}
                          onChange={(option) => {
                            onChange(option?.label || null);
                          }}
                        />
                      )}
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

CreateRestaurantPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
