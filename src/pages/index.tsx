import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/router';
import * as React from 'react';

import Hero from '@/components/layout/Hero';
import PageLoading from '@/components/PageLoading';
import SlidingCardGallery from '@/components/SlidingCardGallery';

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

import { CardData } from '@/types/enum';

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
      showActionButtons: true,
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
  const slidingCards = [];

  for (const key in categories) {
    if (Object.prototype.hasOwnProperty.call(categories, key)) {
      const cards: CardData[] = [];
      for (const restaurant of categories[key]) {
        const card: CardData = {
          title: restaurant.name,
          url: '',
          image: restaurant.image,
        };

        cards.push(card);
      }

      slidingCards.push(
        <SlidingCardGallery key={key} title={key} cards={cards} />
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
        showActionButtons={data.hero.showActionButtons}
      />
      {/* TODO: Discuss with Rob */}
      {/* {slidingCards} */}
    </div>
  );
}

type RestaurantResponse = {
  restaurants: Restaurant[];
  result: number;
};

export async function getServerSideProps() {
  const res: RestaurantResponse = await getData(
    `restaurant?limit=6&category=Try Something New`
  );
  // server side rendering
  return {
    props: {
      restaurants: res.restaurants,
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
