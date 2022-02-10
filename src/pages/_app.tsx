import { NextPage } from 'next';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { SessionProvider } from 'next-auth/react';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '@/components/layout/Layout';

import { GlobalStateProvider } from '@/store/GlobalStore';

const DynamicTailwindElementsWithNoSSR = dynamic(
  () => import('./tailwindElements'),
  { ssr: false }
);

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  return (
    <SessionProvider session={pageProps.session}>
      <GlobalStateProvider>
        <DynamicTailwindElementsWithNoSSR />
        {getLayout(<Component {...pageProps} />)}
        <ToastContainer />
      </GlobalStateProvider>
    </SessionProvider>
  );
}

export default MyApp;
