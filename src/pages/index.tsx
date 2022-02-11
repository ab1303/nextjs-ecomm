import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
import * as React from 'react';

import ImageGallery from '@/components/ImageGallery';
import Hero from '@/components/layout/Hero';
import Loading from '@/components/Loading';
import PageLoading from '@/components/PageLoading';

// import FilterCategory from '@/features/category/FilterCategory';
// import ProductItem from '@/features/product/ProductItem';
import { Restaurant } from '@/models/restaurantModel';
// import {
//   ModalEvent,
//   useGlobalDispatch,
//   useGlobalState,
// } from '@/store/GlobalStore';
import { getData } from '@/utils/fetchHttpClient';
// import filterSearch from '@/utils/filterSearch';
// import { ModalItem } from '@/types';
import { groupBy } from '@/utils/groupBy';

export default function LandingPage(props: RestaurantResponse) {
  // const [products, setProducts] = useState<Product[]>(props.products);

  // const [isCheck, setIsCheck] = useState(false);
  // const [page, setPage] = useState(1);

  // const router = useRouter();

  // const state = useGlobalState();
  // const { auth } = state;
  // const dispatch = useGlobalDispatch();

  // useEffect(() => {
  //   setProducts(props.products);
  // }, [props.products]);

  // useEffect(() => {
  //   if (Object.keys(router.query).length === 0) setPage(1);
  // }, [router.query]);

  // const handleCheck = (id: number) => {
  //   products.forEach((product) => {
  //     if (product._id === id) product.checked = !product.checked;
  //   });
  //   setProducts([...products]);
  // };

  // const handleCheckALL = () => {
  //   products.forEach((product) => (product.checked = !isCheck));
  //   setProducts([...products]);
  //   setIsCheck(!isCheck);
  // };

  // const handleDeleteAll = () => {
  //   const deleteArr: Array<ModalItem> = [];
  //   products.forEach((product) => {
  //     if (product.checked) {
  //       deleteArr.push({
  //         data: '',
  //         id: product._id,
  //         title: 'Delete all selected products?',
  //         type: 'DELETE_PRODUCT',
  //       });
  //     }
  //   });

  //   dispatch({ type: ModalEvent.ADD, payload: { modal: deleteArr } });
  // };

  // const handleLoadmore = () => {
  //   setPage(page + 1);
  //   filterSearch({ router, page: `${page + 1}` });
  // };

  const router = useRouter();
  const { status } = useSession();

  const data = {
    hero: {
      appType: 'Food app',
      tagLine: 'Why stay hungry when you can order',
      description: 'Your favorite restaurants to order from',
      mainActionText: 'Sign in',
      extraActionText: 'Sign up',
    },
  };

  if (status === 'loading') {
    return <PageLoading />;
  }

  if (status === 'authenticated') {
    router.replace('/home');
    return null;
  }

  const categories = groupBy(props.restaurants, (r) => r.category);
  const restaurantList = [];

  for (const key in categories) {
    if (Object.prototype.hasOwnProperty.call(categories, key)) {
      restaurantList.push(
        <ImageGallery key={key} category={key} restaurants={categories[key]} />
      );
    }
  }

  return (
    <div>
      <Head>
        <title>Food Order</title>
      </Head>

      <Hero
        appType={data.hero.appType}
        tagLine={data.hero.tagLine}
        description={data.hero.description}
        mainActionText={data.hero.mainActionText}
        extraActionText={data.hero.extraActionText}
      />

      {restaurantList}

      {/* TODO : Cleanup */}
      {/* {state.categories && <FilterCategory categories={state.categories} />}

      {auth && auth.user && auth.user.role === 'admin' && (
        <div
          className='mt-2 delete_all btn btn-danger'
          style={{ marginBottom: '-10px' }}
        >
          <input
            type='checkbox'
            checked={isCheck}
            onChange={handleCheckALL}
            style={{
              width: '25px',
              height: '25px',
              transform: 'translateY(8px)',
            }}
          />

          <button
            className='ml-2 btn btn-danger'
            data-toggle='modal'
            data-target='#exampleModal'
            onClick={handleDeleteAll}
          >
            DELETE ALL
          </button>
        </div>
      )}

      <div className='products'>
        {products.length === 0 ? (
          <h2>No Products</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              handleCheck={handleCheck}
            />
          ))
        )}
      </div>

      {props.result < page * 6 ? (
        ''
      ) : (
        <button
          className='mx-auto mb-4 btn btn-outline-info d-block'
          onClick={handleLoadmore}
        >
          Load more
        </button>
      )} */}
    </div>
  );
}

type RestaurantResponse = {
  restaurants: Restaurant[];
  result: number;
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const page = query.page || 1;

  const res: RestaurantResponse = await getData(
    `restaurant?limit=${+page * 6}`
  );
  // server side rendering
  return {
    props: {
      restaurants: res.restaurants,
      result: res.result,
    }, // will be passed to the page component as props
  };
}

/**
 * Default info that you should change:
 * components/Seo.tsx
 * next-sitemap.js
 * public/favicon
 *
 * Please refer to the README.md
 */
