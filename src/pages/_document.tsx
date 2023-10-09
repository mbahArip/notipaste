import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta
          name='application-name'
          content='Notipaste'
        />
        <meta
          name='apple-mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='default'
        />
        <meta
          name='apple-mobile-web-app-title'
          content='Notipaste'
        />
        <meta
          name='description'
          content='Notipaste is a simple markdown paste service'
        />
        <meta
          name='format-detection'
          content='telephone=no'
        />
        <meta
          name='mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='msapplication-config'
          content='/icons/browserconfig.xml'
        />
        <meta
          name='msapplication-TileColor'
          content='#ffffff'
        />
        <meta
          name='msapplication-tap-highlight'
          content='no'
        />
        <meta
          name='theme-color'
          content='#11181C'
        />

        <link
          rel='apple-touch-icon'
          href='/icons/apple-touch-icon.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='/icons/apple-touch-icon.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/apple-touch-icon.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='167x167'
          href='/icons/apple-touch-icon.png'
        />

        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/icons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/icons/favicon-16x16.png'
        />
        <link
          rel='manifest'
          href='/manifest.json'
        />
        <link
          rel='shortcut icon'
          href='/favicon.ico'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
