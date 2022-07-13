import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '@/components/layout/Layout';

import { GlobalStateProvider } from '@/store/GlobalStore';

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
        {getLayout(<Component {...pageProps} />)}
        <ToastContainer />
      </GlobalStateProvider>
    </SessionProvider>
  );
}

export default MyApp;
