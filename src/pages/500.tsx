import { Link, Link as NextUILink } from '@nextui-org/react';
import { Routes } from 'constant';

import ContentLayout from 'components/Layout/ContentLayout';

export default function ServerSideErrorPage() {
  return (
    <ContentLayout
      seo={{
        title: 'Server-side error',
      }}
    >
      <div className='flex flex-col items-center gap-4'>
        <h2>500 - Server-side error</h2>
        <div className='flex flex-col text-center text-default-500'>
          <span>It&apos;s not your fault!</span>
          <span>We&apos;re sorry about this. We&apos;ll fix it as soon as possible.</span>
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
