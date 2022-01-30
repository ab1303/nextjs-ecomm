import clsx from 'clsx';
import Script from 'next/script';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Options, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { useDebouncedCallback } from 'use-debounce';
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';

import { RestaurantFormData } from '@/types';

const debounce = 300;
const minLengthAutocomplete = 3;
const selectProps = {
  isClearable: true,
};

export default function AddressComponent({ apiKey }: { apiKey: string }) {
  const {
    init: initialiseGoogleMap,
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

  const {
    register,
    control,
    setValue: formFieldSetValue,
    formState: { errors },
  } = useFormContext<RestaurantFormData>();

  const fetchSuggestions = useDebouncedCallback(
    React.useCallback(
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

  const handleSelect = (selectedOption: SingleValue<{ label: string }>) => {
    if (!selectedOption) {
      formFieldSetValue('address.street_address', '');
      formFieldSetValue('address.suburb', '');
      formFieldSetValue('address.postcode', '');
      formFieldSetValue('address.state', '');
      return;
    }

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
          'address.street_address',
          `${streetAddressNumber || ''} ${streetAddress}`
        );
        formFieldSetValue('address.suburb', suburb || '');
        formFieldSetValue('address.postcode', postalcode || '');
        formFieldSetValue('address.state', state || '');
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };
  return (
    <>
      <Script
        id='google-places'
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        onLoad={() => {
          initialiseGoogleMap();
        }}
      />
      <div>
        <label
          htmlFor='addressLine'
          className={clsx(
            'block text-sm font-medium ',
            errors.address?.addressLine ? 'text-orange-700' : 'text-gray-700'
          )}
        >
          Address
        </label>
        <div className='mt-1'>
          <Controller
            name='address.addressLine'
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange } }) => (
              <AsyncSelect
                {...selectProps}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor:
                      errors.address?.addressLine && 'rgba(194, 65, 12)',
                  }),
                }}
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
          className={clsx(
            'block text-sm font-medium ',
            errors.address?.street_address ? 'text-orange-700' : 'text-gray-700'
          )}
        >
          Street Address
        </label>
        <div className='mt-1'>
          <input
            type='text'
            className={clsx(
              errors.address?.state && 'text-orange-700 border-orange-700'
            )}
            {...register('address.street_address', { required: true })}
          />
        </div>
      </div>
      <div className='flex'>
        <div className='w-1/2 '>
          <label
            htmlFor='suburb'
            className={clsx(
              'block text-sm font-medium ',
              errors.address?.suburb ? 'text-orange-700' : 'text-gray-700'
            )}
          >
            Suburb
          </label>
          <div className='mt-1'>
            <input
              type='text'
              className={clsx(
                errors.address?.suburb && 'text-orange-700 border-orange-700'
              )}
              {...register('address.suburb', { required: true })}
            />
          </div>
        </div>
        <div className='w-1/2 ml-3'>
          <label
            htmlFor='postcode'
            className={clsx(
              'block text-sm font-medium ',
              errors.address?.postcode ? 'text-orange-700' : 'text-gray-700'
            )}
          >
            Post Code
          </label>
          <div className='mt-1'>
            <input
              type='text'
              id='postcode'
              className={clsx(
                errors.address?.postcode && 'text-orange-700 border-orange-700'
              )}
              {...register('address.postcode', { required: true })}
            />
          </div>
        </div>
      </div>
      <div className='flex'>
        <div className='w-1/2 '>
          <label
            htmlFor='state'
            className={clsx(
              'block text-sm font-medium ',
              errors.address?.state ? 'text-orange-700' : 'text-gray-700'
            )}
          >
            State
          </label>
          <div className='mt-1'>
            <input
              type='text'
              className={clsx(
                errors.address?.state && 'text-orange-700 border-orange-700'
              )}
              {...register('address.state', { required: true })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
