import clsx from 'clsx';
import { User } from 'next-auth';
import React, { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

import { postData } from '@/utils/fetchHttpClient';

import { Notify, ProfileData } from '@/types';

type ProfileFormData = ProfileData;

type ProfilePageProps = {
  user: User;
};

export default function ProfilePage({ user }: ProfilePageProps) {
  const formMethods = useForm<ProfileFormData>({
    mode: 'onBlur',
    defaultValues: {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      phone: '+61(AU) 0123 4567',
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submitHandler = async (formData: ProfileFormData) => {
    try {
      const result: { ok: boolean } & Notify = await postData('profile', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
      });

      if (!result.ok) toast.error(result.error);

      toast.success(result.success || 'Profile updated!');
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  return (
    <div className='flex flex-col min-h-screen px-6 bg-gray-100 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <div className='w-3/4 mx-auto'>
          <div>
            <div className='h-20'></div>
            <h2 className='text-3xl font-extrabold text-center text-gray-900'>
              Profile
            </h2>
          </div>

          <div className='grid grid-cols-4 gap-4 bg-gray-400'>
            <div className='col-span-1 border-2'></div>
            <div className='col-span-3 px-6 py-8 mt-8 bg-white border-2 rounded-lg shadow sm:px-10'>
              <FormProvider {...formMethods}>
                <form
                  className='mb-0 space-y-6'
                  onSubmit={handleSubmit(submitHandler)}
                >
                  <div>
                    <label
                      className={clsx(
                        'block text-sm font-medium ',
                        errors.firstname ? 'text-orange-700' : 'text-gray-700'
                      )}
                    >
                      First Name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        className={clsx(
                          errors.firstname &&
                            'text-orange-700 border-orange-700'
                        )}
                        {...register('firstname', { required: true })}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={clsx(
                        'block text-sm font-medium ',
                        errors.lastname ? 'text-orange-700' : 'text-gray-700'
                      )}
                    >
                      Last Name
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        className={clsx(
                          errors.lastname && 'text-orange-700 border-orange-700'
                        )}
                        {...register('lastname', { required: true })}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={clsx(
                        'block text-sm font-medium ',
                        errors.email ? 'text-orange-700' : 'text-gray-700'
                      )}
                    >
                      Email
                    </label>
                    <div className='mt-1'>
                      <input
                        readOnly
                        type='text'
                        className={clsx(
                          errors.email && 'text-orange-700 border-orange-700'
                        )}
                        {...register('email', { required: true })}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={clsx(
                        'block text-sm font-medium ',
                        errors.phone ? 'text-orange-700' : 'text-gray-700'
                      )}
                    >
                      Phone
                    </label>
                    <div className='mt-1'>
                      <input
                        type='text'
                        className={clsx(
                          errors.phone && 'text-orange-700 border-orange-700'
                        )}
                        {...register('phone', { required: false })}
                      />
                    </div>
                  </div>

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
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
