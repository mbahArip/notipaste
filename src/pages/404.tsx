import { Link, Link as NextUILink } from '@nextui-org/react';
import notFound from 'data/404';
import { useEffect, useState } from 'react';

import ContentLayout from 'components/Layout/ContentLayout';

import { Data404 } from 'types/Data';

export default function NotFoundPage() {
  const [errorData, setErrorData] = useState<Data404>();

  useEffect(() => {
    const dataLength = notFound.length;
    const randomIndex = Math.floor(Math.random() * dataLength);
    setErrorData(notFound[randomIndex]);
  }, []);

  return (
    <ContentLayout
      seo={{
        title: '404 Not Found',
      }}
    >
      <div className='flex flex-col items-center gap-4'>
        <h2>404 Not Found</h2>
        <div className='flex flex-col text-center text-default-500'>
          <span>{errorData?.title}</span>
          <span>{errorData?.subtitle}</span>
        </div>
        <NextUILink
          as={Link}
          href='/'
          className='text-center'
        >
          Go back to home
        </NextUILink>
      </div>
    </ContentLayout>
  );
}
