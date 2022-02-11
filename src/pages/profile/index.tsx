import { User } from 'next-auth';
import React, { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

type ProfilePageProps = {
  user: User;
};

export default function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div>
      {' '}
      User Profile Page for {user.firstName} - {user.lastName}
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
