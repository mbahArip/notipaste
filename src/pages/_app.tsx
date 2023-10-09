import { NextUIProvider } from '@nextui-org/react';
import { DefaultSEOConfig } from 'constant';
import { AnimatePresence } from 'framer-motion';
import { DefaultSeo } from 'next-seo';
import useTheme, { ThemeProvider } from 'next-theme';
import { AppProps } from 'next/app';
import { JetBrains_Mono, Montserrat, Zen_Kaku_Gothic_New } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { twMerge } from 'tailwind-merge';

import Footer from 'components/Layout/Footer';
import Navbar from 'components/Layout/Navbar';

import { AuthProvider } from 'contexts/auth';

import 'styles/editor.css';
import 'styles/globals.css';

export const montserrat = Montserrat({
  weight: ['300', '400', '500', '700', '800'],
  preload: true,
  subsets: ['latin', 'latin-ext'],
  variable: '--f-montserrat',
});
export const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['300', '400', '500', '700', '900'],
  preload: true,
  subsets: ['latin', 'latin-ext'],
  variable: '--f-zenkaku',
});
export const jetBrains = JetBrains_Mono({
  weight: ['300', '400', '500', '700', '800'],
  preload: true,
  subsets: ['latin', 'latin-ext'],
  variable: '--f-jetbrains-mono',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--f-jetbrains-mono', jetBrains.variable);
    document.documentElement.style.setProperty('--f-montserrat', montserrat.variable);
    document.documentElement.style.setProperty('--f-zenkaku', zenKaku.variable);
  }, []);

  return (
    <NextUIProvider className={twMerge(montserrat.variable, zenKaku.variable, jetBrains.variable)}>
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
                `flex h-full min-h-screen w-full flex-col font-sans`,
                'bg-gradient-to-t from-content1/50 via-background to-background text-foreground',
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
              <Navbar key={'nav'} />
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
