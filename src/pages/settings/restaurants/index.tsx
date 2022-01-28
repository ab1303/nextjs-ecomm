import { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

// TODO: This is going to be a SSR page with list of restaurants

export default function RestaurantsPage() {
  return <div> Setup Restaurants</div>;
}

RestaurantsPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
