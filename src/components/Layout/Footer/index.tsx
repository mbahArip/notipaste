import { Link as NextUILink } from '@nextui-org/react';
import { Routes } from 'constant';
import Link from 'next/link';

const socials: { name: string; url: string }[] = [
  {
    name: 'Github',
    url: 'https://www.github.com/mbaharip',
  },
  {
    name: 'Twitter',
    url: 'https://www.twitter.com/mbaharip_',
  },
  {
    name: 'Discord',
    url: 'https://discord.com/users/652155604172931102',
  },
  {
    name: 'Email',
    url: 'mailto:support@mbaharip.com',
  },
];

export default function Footer() {
  return (
    <footer className='flex w-full items-center justify-center'>
      <div className='flex w-full max-w-screen-xl flex-col items-center justify-center gap-1 pb-2 pt-6 text-small'>
        <div className='flex items-center gap-1'>
          <strong>Notipaste</strong> built by mbaharip
        </div>
        <div className='my-2 flex items-center gap-4'>
          {socials.map((social) => (
            <NextUILink
              key={social.name}
              href={social.url}
              className='text-small'
              isExternal
            >
              {social.name}
            </NextUILink>
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <NextUILink
            as={Link}
            href={Routes.FAQ}
            className='text-small'
          >
            FAQ
          </NextUILink>
          <NextUILink
            as={Link}
            href={Routes.TOS}
            className='text-small'
          >
            Terms of Service
          </NextUILink>
          <NextUILink
            as={Link}
            href='https://www.github.com/mbaharip/notipaste'
            isExternal
            className='text-small'
          >
            Source Code
          </NextUILink>
        </div>
      </div>
    </footer>
  );
}
