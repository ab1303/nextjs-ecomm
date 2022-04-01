import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { User } from 'next-auth';
import React, { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import Hero from '@/components/layout/Hero';
import SlidingCardGallery from '@/components/SlidingCardGallery';

import {
  CategoryRestaurantsDTO,
  getCategoryCards,
  getCategoryRestaurants,
} from '@/utils/getCategoryRestaurant';

import { CardData } from '@/types/enum';

type HomePageProps = {
  user: User;
  categoryRestaurants: CategoryRestaurantsDTO[];
};

export default function HomePage({ user, categoryRestaurants }: HomePageProps) {
  const slidingCards = [];

  for (const categoryRestaurant of categoryRestaurants) {
    const cards: Array<CardData> = getCategoryCards(categoryRestaurant);

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
      appType: 'Food app',
      tagLine: 'Why stay hungry when you can order',
      description: 'Your favorite restaurants to order from',
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
        description={data.hero.description}
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

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const categoryRestaurants: Array<CategoryRestaurantsDTO> =
    await getCategoryRestaurants(0);

  // server side rendering
  return {
    props: {
      categoryRestaurants: categoryRestaurants,
    }, // will be passed to the page component as props
  };
}
