import { useSession } from 'next-auth/react';
import { ReactElement } from 'react';

import AuthorizedLayout from '@/components/layout/AuthorizedLayout';

export default function HomePage() {
  const { data: session, status } = useSession({ required: true });

  const isUser = !!session?.user;

  if (!isUser) {
    return null;
  }

  return <div> Authorized Home Page</div>;
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthorizedLayout>{page}</AuthorizedLayout>;
};
