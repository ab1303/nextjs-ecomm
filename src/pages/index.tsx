import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import Hero from '@/components/layout/Hero';
import PageLoading from '@/components/PageLoading';
import SlidingCardGallery from '@/components/SlidingCardGallery';

import {
  CategoryRestaurantsDTO,
  getCategoryRestaurants,
} from '@/static-props/getCategoryRestaurant';

import { CardData } from '@/types/enum';

export default function LandingPage({ categoryRestaurants }: LandingPageProps) {
  const router = useRouter();
  const { status } = useSession();

  const data = {
    hero: {
      appType: 'Favorite Restaurant app',
      tagLine: 'Why stay hungry',
      description: 'select your favorite restaurants',
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

  const slidingCards = [];

  for (const categoryRestaurant of categoryRestaurants) {
    const cards: Array<CardData> = categoryRestaurant.restaurants.map((r) => ({
      title: r.name,
      url: `/restaurants/${r._id}`,
      image: r.image,
    }));

    slidingCards.push(
      <SlidingCardGallery
        key={categoryRestaurant.categoryName}
        title={categoryRestaurant.categoryName}
        cards={cards}
      />
    );
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

      {slidingCards}
    </div>
  );
}

type LandingPageProps = {
  categoryRestaurants: CategoryRestaurantsDTO[];
};

export async function getStaticProps() {
  const categoryRestaurants: Array<CategoryRestaurantsDTO> =
    await getCategoryRestaurants(1);

  // server side rendering
  return {
    props: {
      categoryRestaurants: categoryRestaurants,
      // categoryRestaurants: [],
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
