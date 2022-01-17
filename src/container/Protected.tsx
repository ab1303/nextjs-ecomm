import { useSession } from 'next-auth/react';
import * as React from 'react';

import Loading from '@/components/Loading';

interface ProtectedProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function Protected({ children }: ProtectedProps) {
  const { data: session, status } = useSession({ required: true });

  const isUser = !!session?.user;

  if (isUser) {
    return <>{children}</>;
  }

  return <Loading />;
}
