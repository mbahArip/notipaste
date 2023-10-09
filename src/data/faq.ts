import { DataFAQ } from 'types/Data';

const faq: DataFAQ[] = [
  {
    title: 'Is it free to use?',
    content: `The whole service is free, but you can donate to support the development of this service.
In case I will shutdown the service, registered user will be notified and given a chance to download their data.`,
  },
  {
    title: 'The service is down, what should I do?',
    content: `Notepaste page are deployed on Vercel, so the page itself should have a 99.99% uptime, but the Pocketbase (database) server is self-hosted on my own PC.

I will try to keep it online as much as possible, but it might be down sometimes if I need to restart my PC or there are power blackout in my area.`,
  },
  {
    title: 'What is the difference between guest and user?',
    content: `To simplify it, guest can only create public paste, and delete it using the delete link given after creating the paste.
User can create public and private paste, manage the paste via profile page, and also upload image to be used in the paste.`,
  },
  {
    title: 'Will my paste be deleted?',
    content: `Guest paste will be deleted after 14 days, but user paste will be kept forever until they decide to delete it or delete their account.`,
  },
  {
    title: 'Is there any limitation on uploading image?',
    content: 'Yes, the maximum size of the image is 5MB, and we only accept JPG, JPEG, PNG, and GIF.',
  },
  {
    title: 'Can I use this service to store my sensitive data?',
    content: `No, you should not. This service is not designed to store sensitive data, and I will not be responsible for any data leak.`,
  },
  {
    title: 'Can I use this service to store my NSFW data?',
    content: `Yes you can, as long as you don't violate our Terms of Services.`,
  },
  {
    title: 'Is the link inside the paste safe?',
    content: `You will redirected to confirmation page before you can open the link, so you can decide whether you want to open it or not. I will not be responsible for any damage caused by the link inside the paste.`,
  },
  {
    title: 'What will you do with my data?',
    content: `Email, username and password are used for authentication purpose only. I will not share your data to anyone, and I will not use it for any other purpose.
I will only use your email to send you verification link, reset password link, and notification if I will shutdown the service.`,
  },
];

export default faq;
