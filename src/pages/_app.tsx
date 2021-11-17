import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { GlobalStateProvider } from '@/store/GlobalStore';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalStateProvider>
      <Component {...pageProps} />
    </GlobalStateProvider>
  );
}

export default MyApp;
