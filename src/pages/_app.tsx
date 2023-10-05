import { NextUIProvider } from '@nextui-org/react';
import { DefaultSEOConfig } from 'constant';
import { AnimatePresence } from 'framer-motion';
import { DefaultSeo } from 'next-seo';
import useTheme, { ThemeProvider } from 'next-theme';
import { AppProps } from 'next/app';
import { M_PLUS_Rounded_1c } from 'next/font/google';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { twMerge } from 'tailwind-merge';

import Footer from 'components/Layout/Footer';
import Navbar from 'components/Layout/Navbar';

import { AuthProvider } from 'contexts/auth';

import 'styles/globals.css';

const mPlusRounded1c = M_PLUS_Rounded_1c({
  weight: ['300', '400', '500', '700', '800'],
  preload: true,
  subsets: ['latin', 'latin-ext'],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <NextUIProvider>
      <DefaultSeo {...DefaultSEOConfig.seo} />
      <ThemeProvider attribute='class'>
        <AuthProvider>
          <AnimatePresence
            mode='wait'
            onExitComplete={() => {
              if (typeof window !== 'undefined') window.scrollTo(0, 0);
            }}
          >
            <div
              className={twMerge(
                `${mPlusRounded1c.className} flex h-full min-h-screen w-full flex-col`,
                'bg-gradient-to-t from-content1 via-background to-background text-foreground',
              )}
              key={router.asPath}
            >
              <ToastContainer
                autoClose={1500}
                closeButton
                limit={3}
                pauseOnFocusLoss={false}
                pauseOnHover
                position='top-center'
                theme={theme === 'dark' ? 'dark' : 'light'}
              />
              <Navbar />
              <main className='flex h-full max-w-[100vw] flex-grow flex-col overflow-hidden'>
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
          </AnimatePresence>
        </AuthProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
