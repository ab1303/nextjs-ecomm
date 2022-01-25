import clsx from 'clsx';
import { GetServerSidePropsContext } from 'next';
import Script from 'next/script';
import { ReactElement, useCallback } from 'react';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Options, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useDebouncedCallback } from 'use-debounce';
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

type RestaurantFormData = {
  restaurant: string;
  address: string;
  street_address: string;
  suburb: string;
  postcode: string;
  state: string;
};

type RestaurantsPageProps = {
  apiKey: string;
};

const debounce = 300;
const minLengthAutocomplete = 3;
const selectProps = {
  isClearable: true,
};

export default function RestaurantsPage({ apiKey }: RestaurantsPageProps) {
  const {
    init: initialiseGoogleMap,
    value,
    suggestions: { status, data },
    setValue: addressAutoCompleteSetValue,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: 'AU',
      },
    },
    initOnMount: false,
  });

  const fetchSuggestions = useDebouncedCallback(
    useCallback(
      (
        value: string,
        cb: (options: Options<{ label: string }>) => void
      ): void => {
        if (value.length < minLengthAutocomplete) return cb([]);

        addressAutoCompleteSetValue(value);
        cb(
          (data || []).map((suggestion) => ({
            label: suggestion.description,
            value: suggestion,
          }))
        );
      },
      [data, addressAutoCompleteSetValue]
    ),
    debounce
  );

  const formMethods = useForm<RestaurantFormData>({
    mode: 'onBlur',
    defaultValues: {
      restaurant: '',
      address: '',
      street_address: '',
      suburb: '',
      postcode: '',
      state: '',
    },
  });

  const {
    register,
    control,
    setValue: formFieldSetValue,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const handleSelect = (selectedOption: SingleValue<{ label: string }>) => {
    // Get latitude and longitude via utility functions
    getGeocode({ address: selectedOption?.label })
      .then((results) => {
        const addressComponents = results[0].address_components;
        const streetAddressNumber = addressComponents.find((c) =>
          c.types.includes('street_number')
        )?.long_name;

        const streetAddress = addressComponents.find((c) =>
          c.types.includes('route')
        )?.long_name;

        const suburb = addressComponents.find((c) =>
          c.types.includes('locality')
        )?.long_name;

        const state = addressComponents.find((c) =>
          c.types.includes('administrative_area_level_1')
        )?.long_name;

        const postalcode = addressComponents.find((c) =>
          c.types.includes('postal_code')
        )?.long_name;

        formFieldSetValue(
          'street_address',
          `${streetAddressNumber || ''} ${streetAddress}`
        );
        formFieldSetValue('suburb', suburb || '');
        formFieldSetValue('postcode', postalcode || '');
        formFieldSetValue('state', state || '');
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const submitHandler = (formData: RestaurantFormData) => {
    console.log('Restaurant Form Data:', JSON.stringify(formData, null, 2));
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col px-6 lg:px-8'>
      <Script
        id='google-places'
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        onLoad={() => {
          initialiseGoogleMap();
        }}
      />
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
                      <Controller
                        name='address'
                        control={control}
                        render={({ field: { onChange } }) => (
                          <AsyncSelect
                            {...selectProps}
                            loadOptions={fetchSuggestions}
                            getOptionValue={({ label }) => label}
                            onChange={(option) => {
                              handleSelect(option);
                              onChange(option?.label);
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor='street_address'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Street Address
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        className={clsx(
                          errors.state && 'text-orange-700 border-orange-700'
                        )}
                        {...register('street_address', { required: true })}
                      />
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='w-1/2 '>
                      <label
                        htmlFor='suburb'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Suburb
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          className={clsx(
                            errors.suburb && 'text-orange-700 border-orange-700'
                          )}
                          {...register('suburb', { required: true })}
                        />
                      </div>
                    </div>
                    <div className='w-1/2 ml-3'>
                      <label
                        htmlFor='postcode'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Post Code
                      </label>
                      <div className='mt-1'>
                        <input
                          type='text'
                          id='postcode'
                          className={clsx(
                            errors.postcode &&
                              'text-orange-700 border-orange-700'
                          )}
                          {...register('postcode', { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='w-1/2 '>
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

export async function getServerSideProps({ _ }: GetServerSidePropsContext) {
  // server side rendering
  return {
    props: {
      apiKey: process.env.GOOGLE_API_KEY!,
    },
  };
}

RestaurantsPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
