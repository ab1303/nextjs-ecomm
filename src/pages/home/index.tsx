import Head from 'next/head';
import { User } from 'next-auth';
import React, { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import Hero from '@/components/layout/Hero';
import SlidingCardGallery from '@/components/SlidingCardGallery';

import {
  CategoryRestaurantsDTO,
  getCategoryRestaurants,
} from '@/static-props/getCategoryRestaurant';

import { CardData } from '@/types/enum';

type HomePageProps = {
  user: User;
  categoryRestaurants: CategoryRestaurantsDTO[];
  time: string;
};

export default function HomePage({ categoryRestaurants, time }: HomePageProps) {
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

  const data = {
    hero: {
      appType: 'Favorite Restaurant app',
      tagLine: 'Why stay hungry',
      description: 'select your favorite restaurants',
      showActionButtons: false,
    },
  };

  return (
    <div>
      <Head>
        <title>Food Order</title>
      </Head>

      <Hero
        appType={data.hero.appType}
        tagLine={data.hero.tagLine}
        description={`${data.hero.description}`}
        showActionButtons={data.hero.showActionButtons}
        mainActionText=''
        extraActionText=''
      />

      {slidingCards}
    </div>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};

export async function getStaticProps() {
  const categoryRestaurants: Array<CategoryRestaurantsDTO> =
    await getCategoryRestaurants(0);

  // server side rendering
  return {
    props: {
      time: new Date().toISOString(),
      categoryRestaurants: categoryRestaurants,
    },
    revalidate: 10,
  };
}
