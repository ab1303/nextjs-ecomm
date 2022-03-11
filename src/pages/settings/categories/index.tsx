import { ReactElement, useState } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import SplitPanes from '@/components/SplitPanes';

import AddCategory from '@/features/category/AddCategory';
import CategoryDetails from '@/features/category/CategoryDetails';
import { CategoriesResponse, CategoryListDTO } from '@/pages/api/categories';

type CategoriesPageProps = {
  categories: Array<CategoryListDTO>;
  handleCategorySelect: (id: number) => void;
};

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
              <AddCategory
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
