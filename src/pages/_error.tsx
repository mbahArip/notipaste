import { Link, Link as NextUILink } from '@nextui-org/react';
import { Routes } from 'constant';
import notFound from 'data/404';
import { useEffect, useState } from 'react';

import ContentLayout from 'components/Layout/ContentLayout';

import { Data404 } from 'types/Data';

interface ErrorPageProps {
  statusCode: number;
}
export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const [errorData, setErrorData] = useState<Data404>();

  useEffect(() => {
    const dataLength = notFound.length;
    const randomIndex = Math.floor(Math.random() * dataLength);
    setErrorData(notFound[randomIndex]);
  }, []);

  return (
    <ContentLayout
      seo={{
        title: 'Error',
      }}
    >
      <div className='flex flex-col items-center gap-4'>
        <h2>{statusCode}</h2>
        <div className='flex flex-col text-center text-default-500'>
          <span>{statusCode === 404 ? errorData?.title : "It's not your fault!"}</span>
          <span>
            {statusCode === 404 ? errorData?.subtitle : "We're sorry about this. We'll fix it as soon as possible."}
          </span>
        </div>
        <NextUILink
          as={Link}
          href={Routes.HOME}
          className='text-center'
        >
          Go back to home
        </NextUILink>
      </div>
    </ContentLayout>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
