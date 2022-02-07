import clsx from 'clsx';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Card from '@/components/card';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

import AddressComponent from '@/features/Address';
import {
  GetRestaurantDTO,
  GetRestaurantResponse,
} from '@/pages/api/restaurant/[id]';
import { getData, putData } from '@/utils/fetchHttpClient';

import { Notify, RestaurantFormData } from '@/types';

type EditRestaurantFormData = RestaurantFormData;

type EditRestaurantPageProps = {
  apiKey: string;
  restaurant: GetRestaurantDTO;
};

export default function EditRestaurantsPage({
  apiKey,
  restaurant,
}: EditRestaurantPageProps) {
  const router = useRouter();
  const formMethods = useForm<EditRestaurantFormData>({
    mode: 'onBlur',
    defaultValues: {
      restaurantName: restaurant.name,
      address: {
        addressLine: restaurant.address.addressLine,
        street_address: restaurant.address.street_address,
        suburb: restaurant.address.suburb,
        postcode: restaurant.address.postcode,
        state: restaurant.address.state,
      },
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submitHandler = async (formData: EditRestaurantFormData) => {
    try {
      const result: { ok: boolean } & Notify = await putData(
        `restaurant\\${restaurant._id}`,
        {
          restaurantName: formData.restaurantName,
          address: formData.address,
        }
      );

      if (!result.ok) toast.error(result.error);

      toast.success(result.success || 'Restaurant updated!');
      router.replace('/settings/restaurants');
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col px-6 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <div className='mx-auto w-3/4'>
          <Card>
            <Card.Header>
              <div className='justify-between text-left'>
                <Card.Header.Title>Edit Restaurant</Card.Header.Title>
              </div>
            </Card.Header>

            <div className='bg-gray-400'>
              <div className='border-2 bg-white mt-8 py-8 px-6 shadow rounded-lg sm:px-10'>
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

                    <AddressComponent apiKey={apiKey} />

                    <div>
                      <button
                        type='submit'
                        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  // server side rendering

  const id = query.id;
  const response: GetRestaurantResponse = await getData(`restaurant\\${id}`);

  return {
    props: {
      apiKey: process.env.GOOGLE_API_KEY!,
      restaurant: response.restaurant,
    },
  };
}

EditRestaurantsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
