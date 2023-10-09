import { Card, CardBody, CardFooter, CardHeader, Divider, Link, Spinner } from '@nextui-org/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { NextSeo, NextSeoProps } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { LoadingState } from 'types/Helpers';

interface ContentLayoutProps {
  seo?: NextSeoProps;
  children: React.ReactNode;
}
export default function ContentLayout(props: ContentLayoutProps) {
  const router = useRouter();
  const [state, setState] = useState<LoadingState>('idle');
  const [serverStatus, setServerStatus] = useState<'up' | 'down'>('up');

  useEffect(() => {
    const fetchStatus = async () => {
      setState('loading');
      try {
        const res = await axios.get('/api/internal/status');
        if (res.data.status) {
          setServerStatus('up');
        } else {
          setServerStatus('down');
        }
      } catch (error: any) {
        setServerStatus('down');
        console.error(error);
      } finally {
        setState('idle');
      }
    };
    fetchStatus();
  }, []);

  return (
    <>
      <NextSeo {...props.seo} />

      {state === 'loading' ? (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 1.1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut', type: 'tween' }}
          className='flex h-full w-full flex-grow items-center justify-center'
        >
          <Spinner />
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 1.1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut', type: 'tween' }}
            className='relative z-10 mx-auto flex w-full max-w-screen-xl flex-grow flex-col items-center justify-center gap-8 px-4 py-8 tablet:px-4'
          >
            {serverStatus === 'up' ? (
              props.children
            ) : (
              <Card>
                <CardHeader>
                  <h3>Server is currently down</h3>
                </CardHeader>
                <Divider />
                <CardBody className='gap-2'>
                  <div>
                    <h6>What happened?</h6>
                    <p>
                      The server is currently down. <br />
                      It may be under maintenance or experiencing issues. <br />
                      You can try again in couple of minutes, but if the issue persists, please try again in couple of
                      hours.
                    </p>
                  </div>

                  <div>
                    <h6>Why is this happening?</h6>
                    <p>
                      I&apos;m currently host the server on my own computer. <br />
                      It will up for most of the time, but sometimes I need to restart the PC for couple of minutes.{' '}
                      <br />
                      But if you see this message for more than a hour, it means there are power outage on my area. (You
                      can blame the power company for that).
                    </p>
                  </div>

                  <div>
                    <span className='underline'>Thank you for your understanding.</span>
                  </div>
                </CardBody>
                <Divider />
                <CardFooter>
                  <p className='text-center text-small'>
                    If you have any questions, please contact me on{' '}
                    <Link
                      href='mailto:support@mbaharip.com'
                      className='text-small'
                    >
                      support@mbaharip.com
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        </>
      )}
    </>
  );
}
