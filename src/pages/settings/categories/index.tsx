import { ReactElement, useState } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import SplitPanes from '@/components/SplitPanes';

import AddCategory from '@/features/category/AddCategory';
import CategoryDetails from '@/features/category/CategoryDetails';
import { CategoriesResponse, CategoryListDTO } from '@/pages/api/categories';
import { RestaurantListDTO, RestaurantsResponse } from '@/pages/api/restaurant';
import { getData } from '@/utils/fetchHttpClient';

type CategoriesPageProps = {
  categories: Array<CategoryListDTO>;
  restaurants: Array<RestaurantListDTO>;
  handleCategorySelect: (id: number) => void;
};

export default function CategoriesPage({
  categories,
  restaurants,
}: CategoriesPageProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const handleCategorySelect: (id: number) => void = (id: number) => {
    console.log('category selected:', id);
    setSelectedCategoryId(id);
  };

  const handleCategoryDeSelect: () => void = () => {
    setSelectedCategoryId(null);
  };

  const isCategorySelected = !!selectedCategoryId;

  return (
    <div className='bg-gray-100 px-6 py-6 lg:px-8'>
      <div className='container min-w-full mx-auto'>
        <SplitPanes showRightPane={isCategorySelected}>
          {{
            leftPane: (
              <AddCategory
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                handleCategorySelect={handleCategorySelect}
              />
            ),
            rightPane: (
              <CategoryDetails
                selectedCategoryId={selectedCategoryId}
                restaurants={restaurants}
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
  const restaurantResponse: RestaurantsResponse = await getData(`restaurant`);
  const categoriesResponse: CategoriesResponse = await getData(`categories`);
  // server side rendering
  return {
    props: {
      categories: categoriesResponse.categories,
      restaurants: restaurantResponse.restaurants,
    }, // will be passed to the page component as props
  };
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
