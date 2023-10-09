import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Divider } from '@nextui-org/react';
import { Routes } from 'constant';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';

import ContentLayout from 'components/Layout/ContentLayout';

import cookieHelper from 'utils/cookiesHelper';

interface RedirectPageProps {
  url: string;
}
export default function RedirectPage({ url }: RedirectPageProps) {
  return (
    <ContentLayout
      seo={{
        title: 'Open external link',
      }}
    >
      <Card
        classNames={{
          base: 'max-w-screen-md',
        }}
      >
        <CardHeader>
          <h3>Confirmation</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>Are you sure want to open this external link?</p>
          <code className='mx-auto my-2 w-full rounded-medium border border-divider bg-content2 px-2 py-1'>{url}</code>
          <span className='text-small text-default-400'>
            We don&apos;t control the content of this link, so we can&apos;t guarantee its safety.
          </span>
        </CardBody>
        <CardFooter className='justify-between'>
          <Checkbox
            classNames={{
              label: 'text-small',
            }}
            onChange={(e) => {
              const expires = new Date();
              expires.setFullYear(expires.getFullYear() + 1);
              if (e.target.checked) {
                cookieHelper.create('always_redirect', 'true', {
                  expires: expires.toISOString(),
                });
              } else {
                cookieHelper.delete('always_redirect');
              }
            }}
          >
            Don&apos;t ask me again
          </Checkbox>
          <div className='flex items-center gap-2'>
            <Button
              variant='flat'
              color='primary'
              as={Link}
              href={Routes.HOME}
            >
              No
            </Button>
            <Button
              variant='shadow'
              color='danger'
              as={Link}
              href={url}
            >
              Yes
            </Button>
          </div>
        </CardFooter>
      </Card>
    </ContentLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { url } = context.query;
  const cookies = context.req.cookies;
  if (!url)
    return {
      redirect: {
        destination: Routes.HOME,
        permanent: false,
      },
    };

  if (cookies['always_redirect'])
    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };

  return {
    props: {
      url,
    },
  };
}
