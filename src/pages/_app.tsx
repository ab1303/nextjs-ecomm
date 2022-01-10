import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import '@/styles/globals.css';

import Layout from '@/components/layout/Layout';

import { GlobalStateProvider } from '@/store/GlobalStore';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <GlobalStateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalStateProvider>
    </SessionProvider>
  );
}

export default MyApp;
