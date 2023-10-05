import { Accordion, AccordionItem, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import faqs from 'data/faq';

import ContentLayout from 'components/Layout/ContentLayout';

export default function FAQPage() {
  return (
    <ContentLayout
      seo={{
        title: 'Frequently Asked Questions',
      }}
    >
      <Card
        classNames={{
          base: 'max-w-screen-md w-full',
        }}
      >
        <CardHeader>
          <h3>Frequently Asked Questions</h3>
        </CardHeader>
        <Divider />
        <CardBody className='gap-2'>
          <Accordion className='w-full'>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.title.replaceAll(' ', '-').toLowerCase()}
                aria-label={faq.title}
                title={faq.title}
                subtitle={faq.subtitle}
              >
                <p className='whitespace-pre-wrap'>{faq.content}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
        <Divider />
        <CardFooter />
      </Card>
    </ContentLayout>
  );
}
