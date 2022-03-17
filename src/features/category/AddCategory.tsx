import clsx from 'clsx';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Card from '@/components/card';

import {
  CategoryListDTO,
  CreateCategoryResponse,
} from '@/pages/api/categories';
import { postData } from '@/utils/fetchHttpClient';

import { CategoryFormData } from '@/types';

type AddCategoryProps = {
  selectedCategoryId: number | null;
  categories: Array<CategoryListDTO>;
  handleCategorySelect: (id: number) => void;
};

type CreateCategoryFormData = CategoryFormData;

export default function AddCategory({
  selectedCategoryId,
  categories,
  handleCategorySelect,
}: AddCategoryProps) {
  const [categoryList, setCategoryList] =
    useState<CategoryListDTO[]>(categories);

  const formMethods = useForm<CreateCategoryFormData>({
    mode: 'onBlur',
    defaultValues: {
      categoryName: '',
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submitHandler = async (formData: CategoryFormData) => {
    try {
      const result: { ok: boolean } & CreateCategoryResponse = await postData(
        'categories',
        {
          categoryName: formData.categoryName,
        }
      );

      if (!result.ok && result) {
        toast.error(result.error);
        return;
      }

      const updatedCategoryList = [
        ...categoryList,
        { _id: result.id, name: result.name },
      ];

      setCategoryList(updatedCategoryList);
      toast.success(result.success || 'Category created!');
    } catch (e: any) {
      toast.error(e.error);
    }
  };

  return (
    <div className='mx-auto w-4/5'>
      <Card.Header>
        <div className='mt-4 text-left'>
          <Card.Header.Title>Add Category</Card.Header.Title>
        </div>
      </Card.Header>

      <div className='bg-white shadow mt-4 py-8 px-6 sm:px-10'>
        <FormProvider {...formMethods}>
          <form
            className='mb-0 space-y-6'
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className='flex justify-center items-baseline'>
              <label
                className={clsx(
                  'block text-sm font-medium mr-2 ',
                  errors.categoryName ? 'text-orange-700' : 'text-gray-700'
                )}
              >
                Category Name
              </label>
              <input
                type='text'
                className={clsx(
                  'w-3/5',
                  errors.categoryName && 'text-orange-700 border-orange-700'
                )}
                {...register('categoryName', { required: true })}
              />

              <button
                type='submit'
                className='py-2 px-4 ml-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              >
                Add
              </button>
            </div>
          </form>
        </FormProvider>
      </div>

      <div>
        <Card.Header>
          <div className='flex justify-between mt-4  text-left'>
            <Card.Header.Title>
              <strong>List Categories</strong>
            </Card.Header.Title>
          </div>
        </Card.Header>
        <div className='h-96 overflow-y-scroll'>
          {categoryList.map((category) => (
            <div key={category._id} className='flex flex-row'>
              <div
                className={clsx(
                  'mt-4 w-2',
                  selectedCategoryId === category._id
                    ? 'bg-orange-500'
                    : 'bg-orange-300'
                )}
              ></div>
              <div
                className='bg-white cursor-pointer flex flex-row flex-1 align-middle shadow mt-4 py-4 px-6 sm:px-10'
                onClick={() => handleCategorySelect(category._id)}
              >
                <span className='flex-1'>{category.name}</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-6 h-6 cursor-pointer'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  onClick={() => {
                    // TODO: on Delete, make an api call to backend
                    return;
                  }}
                >
                  <path
                    fillRule='evenodd'
                    d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
