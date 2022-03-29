import clsx from 'clsx';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import Select from 'react-select';
import { toast } from 'react-toastify';

import 'react-phone-input-2/lib/style.css';

import Card from '@/components/card';
import ImageUploader from '@/components/image-uploader/ImageUploader';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

import AddressComponent from '@/features/Address';
import {
  GetRestaurantDTO,
  GetRestaurantResponse,
} from '@/pages/api/restaurant/[id]';
import { getData, putData } from '@/utils/fetchHttpClient';

import { Notify, RestaurantFormData } from '@/types';
import { CuisineMap } from '@/types/maps';

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
      cuisine: restaurant.cuisine,
      contact: restaurant.contact,
      imageUrl: restaurant.image,
      thumbnailUrl: restaurant.thumbnail,
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
    control,
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = formMethods;

  const [imageUrl, setImageUrl] = React.useState<string>(restaurant.image);

  const submitHandler = async (formData: EditRestaurantFormData) => {
    try {
      const result: { ok: boolean } & Notify = await putData(
        `restaurant\\${restaurant._id}`,
        {
          restaurantName: formData.restaurantName,
          cuisine: formData.cuisine,
          contact: formData.contact,
          imageUrl: formData.imageUrl,
          thumbnailUrl: formData.thumbnailUrl,
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

  const handleUpload = (image: string) => {
    setImageUrl(image);
    setValue('imageUrl', image);
    setValue(
      'thumbnailUrl',
      image.replace('/upload/', '/upload/c_thumb,w_200/')
    );
  };

  return (
    <div className='flex flex-col min-h-screen px-6 bg-gray-100 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <div className='w-3/4 mx-auto'>
          <Card.Header>
            <div className='mt-4 text-left'>
              <Card.Header.Title>Edit Restaurant</Card.Header.Title>
            </div>
            {imageUrl && (
              <div className='relative mt-4 overflow-hidden rounded shadow-lg h-80'>
                <Image
                  layout='fill'
                  objectFit='cover'
                  src={imageUrl}
                  alt='Image'
                />
              </div>
            )}
          </Card.Header>

          <div className='px-6 py-8 mt-4 bg-white shadow sm:px-10'>
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
                      errors.cuisine ? 'text-orange-700' : 'text-gray-700'
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
                <div>
                  <label
                    className={clsx(
                      'block text-sm font-medium ',
                      errors.contact ? 'text-orange-700' : 'text-gray-700'
                    )}
                  >
                    Contact
                  </label>
                  <div className='mt-1'>
                    <Controller
                      name='contact'
                      control={control}
                      rules={{
                        required: true,
                        validate: (inputNumber) => {
                          const numberExCountryCode =
                            inputNumber.split('61')[1];

                          if (!numberExCountryCode) return false;

                          const phoneLength = numberExCountryCode.length;
                          return phoneLength > 8 && phoneLength < 12;
                        },
                      }}
                      render={({ field: { onChange, value }, fieldState }) => (
                        <PhoneInput
                          enableAreaCodes
                          enableAreaCodeStretch
                          country={'au'}
                          onlyCountries={['au']}
                          value={value}
                          isValid={(inputNumber, country: any, countries) => {
                            if (!fieldState.isDirty) return true;

                            const selectedCountry = countries.find(
                              (c: any) => c.dialCode === country.dialCode
                            ) as any;

                            if (!selectedCountry) {
                              return false;
                            }

                            const numberExDialCode = inputNumber.split(
                              selectedCountry.dialCode
                            )[1];

                            const phoneLength = numberExDialCode.length;

                            return phoneLength > 7 && phoneLength < 10
                              ? true
                              : false;
                          }}
                          onChange={(phone) => onChange(phone)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={clsx(
                      'block text-sm font-medium ',
                      'text-gray-700'
                    )}
                  >
                    Image Upload
                  </label>
                  <div className='mt-1'>
                    <ImageUploader
                      uploadFinished={handleUpload}
                      initialImage={restaurant.image}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={clsx(
                      'block text-sm font-medium ',
                      'text-gray-700'
                    )}
                  >
                    Image Url
                  </label>
                  <div className='mt-1'>
                    <input
                      disabled
                      type='text'
                      {...register('imageUrl')}
                      onChange={(e) => {
                        console.log(e.target.value);
                      }}
                      value={imageUrl ? imageUrl : ''}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={clsx(
                      'block text-sm font-medium ',
                      'text-gray-700'
                    )}
                  >
                    Thumbnail Url
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      disabled
                      {...register('thumbnailUrl')}
                      value={
                        imageUrl
                          ? imageUrl.replace(
                              '/upload/',
                              '/upload/c_thumb,w_200/'
                            )
                          : ''
                      }
                    />
                  </div>
                </div>

                <AddressComponent apiKey={apiKey} propertyName='address' />

                <div>
                  <button
                    type='submit'
                    className='flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                  >
                    Save
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
