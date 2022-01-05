import { AppProps } from 'next/app';

import '@/styles/globals.css';

import Layout from '@/components/layout/Layout';

import { GlobalStateProvider } from '@/store/GlobalStore';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalStateProvider>
  );
}

export default MyApp;
