import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import * as React from 'react';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';

import 'react-phone-input-2/lib/style.css';

import Card from '@/components/card';
import FavoriteSwitch from '@/components/FavoriteSwitch';
import AuthorizedLayout2 from '@/components/layout/AuthorizedLayout2';

import { User } from '@/models/userModel';
import { getData, postData } from '@/utils/fetchHttpClient';

import {
  GetRestaurantDTO,
  GetRestaurantResponse,
} from '../api/restaurant/[id]';

import { Notify } from '@/types';

type ViewRestaurantPageProps = {
  user: User;
  restaurant: GetRestaurantDTO;
  isFavoriteRestaurant: boolean;
};

export default function ViewRestaurantPage({
  user,
  restaurant,
  isFavoriteRestaurant,
}: ViewRestaurantPageProps) {
  const [isFavorite, setIsFavorite] =
    React.useState<boolean>(isFavoriteRestaurant);

  const handleToggleState = async () => {
    try {
      const toggleState = isFavorite ? 'remove' : 'add';

      const result: { ok: boolean } & Notify = await postData(
        `profile/wishlist`,
        {
          restaurantId: restaurant._id,
          link: toggleState,
        }
      );

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setIsFavorite((isFavorite) => !isFavorite);

      const successMsg =
        toggleState === 'add'
          ? 'Restaurant added to wishlist !'
          : 'Restaurant removed from wishlist !';

      toast.success(result.success || successMsg);
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  return (
    <div className='flex flex-col min-h-screen px-6 bg-gray-100 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <div className='w-3/4 mx-auto'>
          <Card.Header>
            <div className='mt-4 text-left'>
              <Card.Header.Title>{restaurant.name}</Card.Header.Title>
            </div>
            {restaurant.image && (
              <div className='relative mt-4 overflow-hidden rounded shadow-lg h-80'>
                <Image
                  layout='fill'
                  objectFit='cover'
                  src={restaurant.image}
                  alt='Image'
                />
              </div>
            )}
          </Card.Header>

          <div className='px-6 py-8 mt-6 bg-white shadow sm:px-10'>
            <div className='flex flex-row justify-between'>
              <div className='font-bold text-xl mb-2'>{restaurant.cuisine}</div>
              {user && (
                <FavoriteSwitch
                  isSelected={isFavorite}
                  onStateChange={handleToggleState}
                />
              )}
            </div>
            <div className='flex flex-row'>
              <label className='block text-bold font-medium mr-10'>
                Address:
              </label>
              <span className='text-gray-700 text-base'>
                {restaurant.address.addressLine}
              </span>
            </div>
            <div className='flex flex-row mt-4'>
              <label className='block text-bold font-medium mr-10'>
                Contact:
              </label>
              <p className='text-gray-700 text-base'>
                <PhoneInput
                  disabled
                  enableAreaCodes
                  enableAreaCodeStretch
                  country={'au'}
                  onlyCountries={['au']}
                  value={restaurant.contact}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // server side rendering

  const session = await getSession(context);
  const { query } = context;
  const id = query.id;
  const response: GetRestaurantResponse =
    session != null
      ? await getData(`restaurant\\${id}?userEmail=${session.user.email}`)
      : await getData(`restaurant\\${id}`);

  return {
    props: {
      restaurant: response.restaurant,
      isFavoriteRestaurant: response.isFavorite,
    },
  };
}

ViewRestaurantPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthorizedLayout2>{page}</AuthorizedLayout2>;
};
