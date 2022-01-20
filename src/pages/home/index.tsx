import { User } from 'next-auth';
import React, { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

type HomePageProps = {
  user: User;
};

export default function HomePage({ user }: HomePageProps) {
  return (
    <div>
      {' '}
      Authorized Home Page for {user.firstName} - {user.lastName}
    </div>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
