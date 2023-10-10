import { Button, Card, CardBody, CardHeader, Divider, Image, Link as NextUILink, Tab, Tabs } from '@nextui-org/react';
import { Routes } from 'constant';
import { motion } from 'framer-motion';
import { GetServerSidePropsContext } from 'next';
import useTheme from 'next-theme';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import ContentLayout from 'components/Layout/ContentLayout';

import { useAuth } from 'contexts/auth';
import pb from 'utils/pocketbase';

interface IndexPageProps {
  created: number;
}
export default function IndexPage(props: IndexPageProps) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [num, setNum] = useState<number>(props.created);

  useEffect(() => {
    pb.collection('notipaste_global').subscribe('*', (data) => {
      if (data.action === 'update') {
        setNum(Number(data.record.value));
      }
    });

    return () => {
      pb.collection('notipaste_global').unsubscribe('*');
    };
  }, []);

  return (
    <ContentLayout>
      <section
        id='hero'
        className='relative flex min-h-[60vh] flex-col items-center justify-center gap-2 py-8'
      >
        <h1 className='text-6xl'>Notipaste</h1>
        <h2 className='text-center'>
          Simple, fast, and secure pastebin service <br />
        </h2>
        <h4 className='flex items-center gap-2 whitespace-nowrap'>
          Total of{' '}
          <div className='flex items-center'>
            {String(num)
              .split('')
              .map((n) => (
                <motion.div
                  key={`counter-${n}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                    type: 'tween',
                  }}
                >
                  {n}
                </motion.div>
              ))}
          </div>
          pastes have been created
        </h4>
        <p className='text-center text-default-400'>
          Create a paste and share it with your friends. <br />
          No account required.
        </p>
        <div className='flex items-center gap-2'>
          <Button
            as={Link}
            href={!user ? Routes.LOGIN : Routes.PROFILE}
            variant='shadow'
            color='default'
          >
            {!user ? 'Sign In' : 'My Pastes'}
          </Button>
          <Button
            as={Link}
            href={Routes.NEW_PASTE}
            variant='shadow'
            color='primary'
          >
            Create new paste
          </Button>
        </div>
      </section>

      <section
        id='features'
        className='relative grid grid-cols-1 gap-8 py-8 tablet:grid-cols-2'
      >
        <div className='relative h-[256px] w-full tablet:h-[480px]'>
          <div
            className={twMerge(
              'absolute left-0 top-0 opacity-100 transition-opacity',
              theme === 'light' && 'opacity-0',
            )}
          >
            <Image
              src='/img/preview-dark.webp'
              alt='Preview'
              removeWrapper
              className='bg-content1 shadow-medium'
            />
          </div>
          <div
            className={twMerge('absolute left-0 top-0 opacity-100 transition-opacity', theme === 'dark' && 'opacity-0')}
          >
            <Image
              src='/img/preview-light.webp'
              alt='Preview'
              removeWrapper
              className='bg-content1 shadow-medium'
            />
          </div>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <h2 className='text-4xl font-bold'>Features</h2>
          <p className='text-default-500'>
            Notipaste are powered by{' '}
            <NextUILink
              href='https://github.com/Darginec05/Yopta-Editor'
              isExternal
              showAnchorIcon
            >
              Yopta-Editor
            </NextUILink>{' '}
            and{' '}
            <NextUILink
              href='https://www.slatejs.org/'
              isExternal
              showAnchorIcon
            >
              Slate
            </NextUILink>{' '}
            to bring Notion-like experience to you when creating a paste. <br /> With this you can easily create a paste
            with rich text, code, media and many more.
          </p>
          <ul className='mt-4 grid w-full list-outside list-disc grid-cols-1 gap-1 px-8 text-default-500 tablet:grid-cols-2 tablet:px-4 tablet:text-small'>
            <li>Rich text editor</li>
            <li>Code block with syntax highlighting</li>
            <li>Media support (Image, and Video)</li>
            <li>Embed support (YouTube, Twitter, etc)</li>
            <li>Expiration date</li>
            <li>Password protection</li>
          </ul>
        </div>
      </section>

      <section
        id='pricing'
        className='relative grid w-full grid-cols-1 gap-8 py-8 tablet:grid-cols-2'
      >
        <div className='flex w-full flex-col items-center gap-2'>
          <h2 className='text-4xl font-bold'>Pricing</h2>
          <p className='text-center text-default-500'>
            Notipaste is 100% free to use.
            <br />
            No ads, no tracking, no bullshit.
          </p>
          <h3 className='mt-4'>What&apos;s the catch?</h3>
          <p className='text-center text-default-500'>
            I&apos;m hosting this service on my own computer. <br /> So it will down for couple minutes when I need to
            restart my computer. <br /> But if it&apos;s down for more than a hour, it means there are power outage on
            my area. (You can blame the power company for that).
          </p>
        </div>

        <div className='flex flex-col items-center gap-2'>
          <Tabs
            aria-label='Pricing'
            size='lg'
          >
            <Tab
              key={'guest'}
              title='Guest user'
              className='w-full'
            >
              <Card>
                <CardHeader>
                  <h3>Guest user</h3>
                </CardHeader>
                <Divider />
                <CardBody className='gap-4'>
                  <p>
                    Guest user are user that are not logged in. <br />
                    They can only create paste and delete it with the token provided.
                  </p>
                  <ul className='list-inside list-disc'>
                    <li>Create unlimited paste</li>
                    <li>Delete paste with provided token</li>
                    <li>Paste will be deleted after 14 days</li>
                    <li>Can only add media via external link</li>
                  </ul>
                </CardBody>
              </Card>
            </Tab>
            <Tab
              key={'registered'}
              title='Registered user'
              className='w-full'
            >
              <Card>
                <CardHeader>
                  <h3>Registered user</h3>
                </CardHeader>
                <Divider />
                <CardBody className='gap-4'>
                  <p>
                    Registered user are user that are logged in. <br />
                    They have more features than guest user. (ofc duh.)
                  </p>
                  <ul className='list-inside list-disc'>
                    <li>Create unlimited paste</li>
                    <li>Manage created paste</li>
                    <li>Set expiration date for each paste</li>
                    <li>Protect paste with password</li>
                    <li>Set paste visibility</li>
                    <li>Upload media</li>
                  </ul>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </section>

      {/* Background */}
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 1.4 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: 'easeInOut', type: 'tween' }}
        className='absolute -left-64 -top-64 -z-10 h-[48rem] w-[48rem] bg-gradient-radial from-primary/10 via-transparent to-transparent tablet:-left-0 tablet:-top-48 tablet:right-auto'
      />
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 1.4 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: 'easeInOut', type: 'tween' }}
        className='absolute -top-16 left-0 -z-10 h-[52rem] w-[52rem] bg-gradient-radial from-primary/25 via-transparent to-transparent tablet:-right-48 tablet:-top-32 tablet:left-auto'
      />
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 1.4 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: 'easeInOut', type: 'tween', delay: 0.25 }}
        className='absolute -right-36 top-0 -z-10 h-[96rem] w-[96rem] bg-gradient-radial from-secondary/20 via-transparent to-transparent tablet:left-auto tablet:right-72 tablet:top-0'
      />
    </ContentLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const created = await pb.collection('notipaste_global').getList(1, 1, {
    filter: 'key = "paste_counter"',
  });

  return {
    props: {
      created: Number(created.items[0].value),
    },
  };
}
