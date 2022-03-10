import clsx from 'clsx';
import { MouseEventHandler, ReactElement, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import Card from '@/components/card';
import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

import { CategoriesResponse, CategoryListDTO } from '@/pages/api/categories';
import { postData } from '@/utils/fetchHttpClient';

import { CategoryFormData, Notify } from '@/types';

type CategoriesPageProps = {
  categories: Array<CategoryListDTO>;
  handleCategorySelect: (id: number) => void;
};

type CreateCategoryFormData = CategoryFormData;

function Categories({ categories, handleCategorySelect }: CategoriesPageProps) {
  const formMethods = useForm<CreateCategoryFormData>({
    mode: 'onBlur',
    defaultValues: {
      categoryName: '',
    },
  });

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submitHandler = async (formData: CategoryFormData) => {
    try {
      const result: { ok: boolean } & Notify = await postData('categories', {
        categoryName: formData.categoryName,
      });

      if (!result.ok) toast.error(result.error);

      // TODO: Update categories collection
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
                  'block text-sm font-medium mr-10 ',
                  errors.categoryName ? 'text-orange-700' : 'text-gray-700'
                )}
              >
                Name
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
          {categories.map((category) => (
            <div
              key={category._id}
              className='bg-white cursor-pointer shadow mt-4 py-4 px-6 sm:px-10'
              onClick={() => handleCategorySelect(category._id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type CategoryDetailsProps = {
  handleCategoryDeSelect: () => void;
};

function CategoryDetails({ handleCategoryDeSelect }: CategoryDetailsProps) {
  return (
    <div className='mx-auto'>
      <Card.Header>
        <div className='mt-4 text-left flex flex-row justify-between'>
          <Card.Header.Title>Category Details</Card.Header.Title>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 cursor-pointer'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
            onClick={handleCategoryDeSelect}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </div>
      </Card.Header>
      <div className='bg-white h-96 shadow mt-4'></div>
    </div>
  );
}

function SplitPanes({
  showRightPane,
  children,
}: {
  showRightPane: boolean;
  children: { rightPane: React.ReactNode; leftPane: React.ReactNode };
}) {
  const { leftPane, rightPane } = children;
  return (
    <div className='flex flex-row'>
      <div className='flex-1'>{leftPane}</div>
      {showRightPane && (
        <div className={clsx('flex-1')}>
          <div className=''>{rightPane}</div>
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  const [isCategorySelected, setIsCategorySelected] = useState<boolean>(false);

  const handleCategorySelect: (id: number) => void = (id: number) => {
    console.log('category selected:', id);
    setIsCategorySelected(true);
  };

  const handleCategoryDeSelect: () => void = () => {
    setIsCategorySelected(false);
  };

  return (
    <div className='bg-gray-100 px-6 py-6 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <SplitPanes showRightPane={isCategorySelected}>
          {{
            leftPane: (
              <Categories
                categories={categories}
                handleCategorySelect={handleCategorySelect}
              />
            ),
            rightPane: (
              <CategoryDetails
                handleCategoryDeSelect={handleCategoryDeSelect}
              />
            ),
          }}
        </SplitPanes>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // TODO: Later Pagination

  // const page = query.page || 1;
  // const category = query.category || 'all';
  // const sort = query.sort || '';
  // const search = query.search || 'all';

  // const response: CategoriesResponse = await getData(`categories`);
  const response: CategoriesResponse = {
    categories: [
      {
        _id: 1,
        name: 'First Category',
      },
      {
        _id: 2,
        name: 'Second Category',
      },
      {
        _id: 3,
        name: 'Third Category',
      },
      {
        _id: 4,
        name: 'Four Category',
      },
      {
        _id: 5,
        name: 'Five Category',
      },
      {
        _id: 6,
        name: 'Six Category',
      },
      {
        _id: 7,
        name: 'Seven Category',
      },
      {
        _id: 8,
        name: 'Eight Category',
      },
      {
        _id: 9,
        name: 'Nine Category',
      },
    ],
  };
  // server side rendering
  return {
    props: {
      categories: response.categories,
    }, // will be passed to the page component as props
  };
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
