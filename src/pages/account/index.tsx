import { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

export default function HomePage() {
  return <div> Authorized Home Page</div>;
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
