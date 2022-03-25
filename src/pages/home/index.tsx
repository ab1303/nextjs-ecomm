import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { User } from 'next-auth';
import React, { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';
import Hero from '@/components/layout/Hero';
import SlidingCardGallery from '@/components/SlidingCardGallery';

import { Restaurant } from '@/models/restaurantModel';
import { getData } from '@/utils/fetchHttpClient';
import { groupBy } from '@/utils/groupBy';

import { CardData } from '@/types/enum';

type HomePageProps = {
  user: User;
  restaurants: Restaurant[];
  result: number;
};

export default function HomePage({ user, restaurants }: HomePageProps) {
  const categories = groupBy(restaurants, (r) => r.category);
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

      {/* TODO: Discuss with Rob */}
      {/* {slidingCards} */}
    </div>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const res: HomePageProps = await getData(`restaurant?limit=50`);
  // server side rendering
  return {
    props: {
      restaurants: res.restaurants,
      // result: res.result,
    }, // will be passed to the page component as props
  };
}
