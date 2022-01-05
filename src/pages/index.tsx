import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import Hero from '@/components/layout/Hero';

import FilterCategory from '@/features/category/FilterCategory';
import ProductItem from '@/features/product/ProductItem';
import { Product } from '@/models/productModel';
import {
  ModalEvent,
  useGlobalDispatch,
  useGlobalState,
} from '@/store/GlobalStore';
import { getData } from '@/utils/fetchData';
import filterSearch from '@/utils/filterSearch';

import { ModalItem } from '@/types';

export default function HomePage(props: ProductResponse) {
  const [products, setProducts] = useState<Product[]>(props.products);

  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const state = useGlobalState();
  const { auth } = state;
  const dispatch = useGlobalDispatch();

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  const handleCheck = (id: number) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckALL = () => {
    products.forEach((product) => (product.checked = !isCheck));
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAll = () => {
    const deleteArr: Array<ModalItem> = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: '',
          id: product._id,
          title: 'Delete all selected products?',
          type: 'DELETE_PRODUCT',
        });
      }
    });

    dispatch({ type: ModalEvent.ADD, payload: { modal: deleteArr } });
  };

  const handleLoadmore = () => {
    setPage(page + 1);
    filterSearch({ router, page: `${page + 1}` });
  };

  const data = {
    hero: {
      appType: 'Food app',
      tagLine: 'Why stay hungry when you can order from Bella Onojie',
      description: 'Download the bella onoje’s food app now on',
      mainActionText: 'Playstore',
      extraActionText: 'App Store',
    },
  };

  return (
    <div className='home_page'>
      <Head>
        <title>Home Page</title>
      </Head>

      <Hero
        appType={data.hero.appType}
        tagLine={data.hero.tagLine}
        description={data.hero.description}
        mainActionText={data.hero.mainActionText}
        extraActionText={data.hero.extraActionText}
      />

      {state.categories && <FilterCategory categories={state.categories} />}

      {auth && auth.user && auth.user.role === 'admin' && (
        <div
          className='delete_all btn btn-danger mt-2'
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
            className='btn btn-danger ml-2'
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
          className='btn btn-outline-info d-block mx-auto mb-4'
          onClick={handleLoadmore}
        >
          Load more
        </button>
      )}
    </div>
  );
}

type ProductResponse = {
  products: Product[];
  result: number;
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const page = query.page || 1;
  const category = query.category || 'all';
  const sort = query.sort || '';
  const search = query.search || 'all';

  const res: ProductResponse = await getData(
    `product?limit=${
      +page * 6
    }&category=${category}&sort=${sort}&title=${search}`
  );
  // server side rendering
  return {
    props: {
      products: res.products,
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
