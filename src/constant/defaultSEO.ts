import { DefaultSeoProps } from 'next-seo';

export const seo: DefaultSeoProps = {
  titleTemplate: '%s | Notipaste',
  defaultTitle: 'Notipaste',
  description:
    'Notipaste is a simple markdown paste service built by mbaharip as a learning project using Next.js and Pocketbase.',
  openGraph: {
    title: 'Notipaste',
    description:
      'Notipaste is a simple markdown paste service built by mbaharip as a learning project using Next.js and Pocketbase.',
    url: process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://notipaste.mbaharip.com',
    siteName: 'Notipaste',
    images: [
      {
        url: '/img/og-image.webp',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'twitter:title',
      content: 'Notipaste',
    },
    {
      name: 'twitter:description',
      content:
        'Notipaste is a simple markdown paste service built by mbaharip as a learning project using Next.js and Pocketbase.',
    },
    {
      name: 'twitter:image',
      content: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://notipaste.mbaharip.com'}/img/og-image.webp`,
    },
  ],
};
