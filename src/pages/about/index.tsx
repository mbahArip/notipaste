import { Card, CardBody, CardHeader, Divider, Link as NextUILink } from '@nextui-org/react';

import ContentLayout from 'components/Layout/ContentLayout';

export default function AboutPage() {
  return (
    <ContentLayout
      seo={{
        title: 'What is Notipaste?',
      }}
    >
      <Card>
        <CardHeader>
          <h3>What is Notipaste?</h3>
        </CardHeader>
        <Divider />
        <CardBody className='gap-2'>
          <div>
            <h6>What?</h6>
            <p>
              Notipaste is a free and open-source markdown pastebin that allows you to share your notes and code
              snippets with others.
              <br />
              Notipaste is built with{' '}
              <NextUILink
                href='https://nextjs.org'
                isExternal
                showAnchorIcon
              >
                Next.js
              </NextUILink>
              ,{' '}
              <NextUILink
                href='https://nextui.org'
                isExternal
                showAnchorIcon
              >
                NextUI
              </NextUILink>
              , and{' '}
              <NextUILink
                href='https://pocketbase.io'
                isExternal
                showAnchorIcon
              >
                Pocketbase
              </NextUILink>
              .
            </p>
          </div>
          <div>
            <h6>Why?</h6>
            <p>
              The main reason why I created Notipaste is because I want to learn more about Pocketbase.
              <br />
              But I don&apos;t want to create a project that won&apos;t be used atleast by me.
              <br />
              So I decided to create a pastebin, because I use pastebin a lot to share my code snippets with others.
            </p>
          </div>
          <div>
            <h6>Can I self-host Notipaste?</h6>
            <p>
              Absolutely! Notipaste is open-source, so you can fork the repository and host it on your own server.
              <br />
              <NextUILink
                href='https://www.github.com/mbaharip/notipaste'
                isExternal
                showAnchorIcon
              >
                See the source code on GitHub
              </NextUILink>
            </p>
          </div>
        </CardBody>
      </Card>
    </ContentLayout>
  );
}
