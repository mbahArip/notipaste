import { Card, CardBody, CardFooter, CardHeader, Divider, Link } from '@nextui-org/react';

import ContentLayout from 'components/Layout/ContentLayout';

export default function ToSPage() {
  return (
    <ContentLayout
      seo={{
        title: 'Terms of Services',
      }}
    >
      <Card
        classNames={{
          base: 'max-w-screen-lg',
        }}
      >
        <CardHeader>
          <h3>Terms of Services</h3>
        </CardHeader>
        <Divider />
        <CardBody className='gap-2'>
          <p>
            Welcome to <strong>Notipaste</strong>!
            <br />
            By using Notipaste, you agree to the following terms of services, either as an anonymous user or as a
            registered user.
          </p>

          <div>
            <h5>Allowed content</h5>
            <p>
              You may use our service to write anything you like, as long as it is not illegal or hamful.
              <br />
              This includes, but is not limited to:
            </p>
            <ul className='list-inside list-disc'>
              <li>
                <strong>Creative writing</strong>, such as stories, poems, etc.
              </li>
              <li>
                <strong>Informative writing</strong>, such as articles, essays, and tutorials.
              </li>
              <li>
                <strong>Code snippets</strong>, such as HTML, CSS, JavaScript, Python, etc.
              </li>
              <li>
                <strong>Technical documents</strong>, such as documentation, manuals, etc.
              </li>
              <li>
                <strong>Other</strong>, such as to-do lists, shopping lists, etc.
              </li>
            </ul>
          </div>

          <div>
            <h5>Prohibited content</h5>
            <p>
              You may not use our service to write anything that is illegal or harmful.
              <br />
              This includes, but is not limited to:
            </p>
            <ul className='list-inside list-disc'>
              <li>
                <strong>Illegal content</strong>, such as hate speech, child pornography, threats of violence, etc.
              </li>
              <li>
                <strong>Harmful</strong>, such as content that promotes self-harm or suicide.
              </li>
              <li>
                <strong>Doxxing</strong>, content that publicly revealing someone&apos;s private information. Including
                person behind Vtuber.
              </li>
              <li>
                <strong>Spam or Advertising</strong>, this includes any content that is intended to promote a product,
                service, or website, or any content that is considered spam
              </li>
            </ul>
          </div>

          <div>
            <h5>Enforcement</h5>
            <p>
              We reserve the right to remove any content or even suspend or terminate account that violates our terms of
              service.
            </p>
          </div>

          <div>
            <h5>Changes</h5>
            <p>
              We may update our terms of service from time to time. If we make any changes, we will post the updated
              terms of service on our website. Your continued use of our service after we post the updated terms of
              service will constitute your acceptance of the updated terms of service.
            </p>
          </div>

          <div>
            <h5>Contact Us</h5>
            <p>
              If you have any questions about our terms of service, please contact us at{' '}
              <Link href='mailto:support@mbaharip.com'>support@mbaharip.com</Link>
            </p>
          </div>

          <p>
            We also want to remind you that you are responsible for the content you write. We are not responsible for
            any content that you write using our service.
            <br />
            If you see any content that violates our terms of service, please report it to us by clicking the report
            button on the content.
          </p>
        </CardBody>
        <Divider />
        <CardFooter></CardFooter>
      </Card>
    </ContentLayout>
  );
}
