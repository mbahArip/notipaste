import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Link as NextUILink,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { Routes } from 'constant';
import { motion } from 'framer-motion';
import { icons } from 'lucide-react';
import useTheme from 'next-theme';
import { Noto_Serif_Georgian } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import Icon from 'components/Shared/Icon';

import { useAuth } from 'contexts/auth';
import sleep from 'utils/sleep';

import { LoadingState } from 'types/Helpers';

const georgia = Noto_Serif_Georgian({
  weight: ['300', '400', '500', '700', '800'],
  preload: true,
  subsets: ['latin', 'latin-ext'],
});

const routes: { name: string; href: string; external?: boolean; icon?: keyof typeof icons }[] = [
  {
    name: 'Home',
    href: Routes.HOME,
  },
  {
    name: 'What is Notipaste?',
    href: Routes.ABOUT,
  },
];
const themes: { name: string; icon: keyof typeof icons; value: string; description?: string }[] = [
  {
    name: 'Light',
    icon: 'Sun',
    value: 'light',
  },
  {
    name: 'Dark',
    icon: 'Moon',
    value: 'dark',
  },
  {
    name: 'System',
    icon: 'SunMoon',
    value: 'system',
    description: 'Follow your system theme',
  },
];
const supports: { name: string; url: string }[] = [
  {
    name: 'Paypal',
    url: 'https://paypal.me/mbaharip',
  },
  {
    name: 'Buy me a coffee',
    url: 'https://www.buymeacoffee.com/mbaharip',
  },
  {
    name: 'Karyakarsa',
    url: 'https://karyakarsa.com/mbaharip',
  },
];

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, setUserData, logout, isLoading } = useAuth();

  const [mobileMenuExtended, setMobileMenuExtended] = useState<boolean>(false);
  useEffect(() => {
    // const close = async () => {
    //   await sleep(150);
    setMobileMenuExtended(false);
    // };
    // close();
  }, [router.asPath]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mobileMenuExtended) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }, [mobileMenuExtended]);

  const [supportOpen, setSupportOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authState, setAuthState] = useState<LoadingState>('idle');
  const [authInput, setAuthInput] = useState<Record<'username' | 'email' | 'password' | 'confirmPassword', string>>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [authError, setAuthError] = useState<
    Record<'username' | 'email' | 'password' | 'confirmPassword' | 'form', string>
  >({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    form: '',
  });
  useEffect(() => {
    setAuthError({ username: '', email: '', password: '', confirmPassword: '', form: '' });
  }, [authInput]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = authInput;
    if (!username) return setAuthError({ ...authError, username: 'Username cannot be empty' });
    if (!password) return setAuthError({ ...authError, password: 'Password cannot be empty' });

    setAuthState('loading');
    try {
      const response = await axios
        .post(
          '/api/internal/auth/login',
          {
            username,
            password,
          },
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        )
        .then((res) => res.data);
      setAuthOpen(false);
      await sleep(250);
      setUserData(response.data.record);
      toast.success('Logged in successfully');
      setAuthError({ username: '', email: '', password: '', confirmPassword: '', form: '' });
      setAuthInput({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const response = error.response?.data;
        console.error(response);
        switch (response.scope) {
          case 'username':
            setAuthError({ ...authError, username: response.message ?? response.error });
            break;
          case 'password':
            setAuthError({ ...authError, password: response.message ?? response.error });
            break;
          default:
            setAuthError({ ...authError, form: response.message ?? response.error });
            break;
        }
        toast.error('Failed to login');
      } else {
        console.error(error);
        setAuthError({ ...authError, form: 'Something went wrong' });
        toast.error('Failed to login');
      }
    } finally {
      setAuthState('idle');
    }
  };
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = authInput;
    if (!username) return setAuthError({ ...authError, username: 'Username cannot be empty' });
    if (username.length < 4)
      return setAuthError({ ...authError, username: 'Username must be at least 4 characters long' });
    if (!email) return setAuthError({ ...authError, email: 'Email cannot be empty' });
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false)
      return setAuthError({ ...authError, email: 'Email is invalid' });
    if (!password) return setAuthError({ ...authError, password: 'Password cannot be empty' });
    if (password.length < 8)
      return setAuthError({ ...authError, password: 'Password must be at least 8 characters long' });
    if (!confirmPassword) return setAuthError({ ...authError, confirmPassword: 'Confirm password cannot be empty' });
    if (password !== confirmPassword)
      return setAuthError({ ...authError, confirmPassword: 'Confirm password must match password' });

    setAuthState('loading');
    try {
      const response = await axios
        .post(
          '/api/internal/auth/register',
          {
            username,
            email,
            password,
            confirmPassword,
          },
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        )
        .then((res) => res.data);

      toast.success(response.message);
      setAuthError({ username: '', email: '', password: '', confirmPassword: '', form: '' });
      setAuthInput({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const response = error.response?.data;
        console.error(response);
        switch (response.scope) {
          case 'username':
            setAuthError({ ...authError, username: response.message ?? response.error });
            break;
          case 'email':
            setAuthError({ ...authError, email: response.message ?? response.error });
            break;
          case 'password':
            setAuthError({ ...authError, password: response.message ?? response.error });
            break;
          case 'confirmPassword':
            setAuthError({ ...authError, confirmPassword: response.message ?? response.error });
            break;
          default:
            setAuthError({ ...authError, form: response.message ?? response.error });
            break;
        }
        toast.error('Failed to create account');
      } else {
        console.error(error);
        setAuthError({ ...authError, form: 'Something went wrong' });
        toast.error('Failed to create account');
      }
    } finally {
      setAuthState('idle');
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    await sleep(250);
    logout();
  };

  return (
    <nav className='sticky top-0 z-50 flex w-full flex-col items-center justify-center bg-background/50 backdrop-blur'>
      <div className='relative z-50 flex w-full max-w-screen-xl items-center justify-between gap-4 p-2'>
        <div className='flex items-end gap-4'>
          {/* Logo */}
          <div className='flex select-none items-center gap-2'>
            <div
              className='relative top-0 flex h-8 w-8 items-center justify-center tablet:hidden'
              onClick={() => setMobileMenuExtended((prev) => !prev)}
            >
              <Icon
                name='Menu'
                className={twMerge(
                  'absolute transition duration-150',
                  mobileMenuExtended && 'pointer-events-none rotate-90 opacity-0',
                )}
              />
              <Icon
                name='X'
                className={twMerge(
                  'absolute transition duration-150',
                  !mobileMenuExtended && 'pointer-events-none -rotate-90 opacity-0',
                )}
              />
            </div>
            <img
              loading='eager'
              src='/icon.svg'
              alt='Notipaste'
              width={32}
              height={32}
              className={twMerge('-mr-2 hidden tablet:flex')}
            />
            {/* <Icon
              name='FileEdit'
              size='lg'
              className='hidden tablet:block'
            /> */}
            <h1 className={`text-2xl font-bold`}>Notipaste</h1>
          </div>

          {/* Links */}
          <ul className='hidden items-center gap-2 tablet:flex'>
            {routes.map((route) => (
              <NextUILink
                as={Link}
                href={route.href}
                key={route.name}
                isExternal={route.external}
                showAnchorIcon={route.external}
                color='foreground'
                className={twMerge(
                  'flex items-center gap-1',
                  router.asPath === route.href
                    ? 'font-bold opacity-100'
                    : 'font-normal opacity-80 transition hover:opacity-100',
                )}
              >
                {route.icon && (
                  <Icon
                    name={route.icon}
                    size='sm'
                  />
                )}
                {route.name}
              </NextUILink>
            ))}
          </ul>
        </div>

        <div className='flex items-center justify-center gap-4'>
          <div className='flex items-center gap-1'>
            {/* Support me */}
            <Dropdown
              isOpen={supportOpen}
              onOpenChange={(e) => setSupportOpen(e)}
              showArrow
              offset={16}
              size='sm'
            >
              <DropdownTrigger>
                <Button
                  variant='light'
                  isIconOnly
                  radius='full'
                  className='hidden aria-expanded:opacity-100 tablet:flex'
                >
                  <Icon
                    name='Heart'
                    className={twMerge(
                      'fill-transparent text-foreground',
                      supportOpen && 'fill-pink-500 text-pink-500 dark:fill-pink-300 dark:text-pink-300',
                    )}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Support me'
                onAction={(e) => window.open(e as string, '_blank')}
              >
                <DropdownSection>
                  {supports.map((support) => (
                    <DropdownItem
                      key={support.url}
                      textValue={support.url}
                      endContent={
                        <Icon
                          name='ExternalLink'
                          size='sm'
                        />
                      }
                    >
                      {support.name}
                    </DropdownItem>
                  ))}
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>

            {/* Theme switch */}
            <Dropdown
              showArrow
              offset={16}
              size='sm'
            >
              <DropdownTrigger>
                <Button
                  variant='light'
                  isIconOnly
                  radius='full'
                  className='aria-expanded:opacity-100'
                >
                  <Icon name={theme === 'dark' ? 'Moon' : 'Sun'} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Theme switch'
                onAction={(e) => {
                  setTheme(e as string);
                }}
              >
                {themes.map((theme) => (
                  <DropdownItem
                    key={theme.value}
                    textValue={theme.value}
                    description={theme.description}
                    startContent={<Icon name={theme.icon} />}
                  >
                    {theme.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              as={Link}
              href={Routes.NEW_PASTE}
              variant='shadow'
              color='primary'
              radius='full'
              className='aspect-square min-w-0 aria-expanded:opacity-100 tablet:aspect-auto'
            >
              <Icon name='PlusSquare' />
              <span className='hidden tablet:inline'>New paste</span>
            </Button>
          </div>

          {/* User */}
          {isLoading ? (
            <Spinner size='sm' />
          ) : (
            <>
              {user ? (
                <Dropdown
                  showArrow
                  offset={16}
                  isOpen={profileOpen}
                  onOpenChange={(e) => setProfileOpen(e)}
                >
                  <DropdownTrigger>
                    <Avatar
                      src={user.avatar}
                      className='cursor-pointer'
                      isBordered
                    />
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='User menu'
                    variant='flat'
                  >
                    <DropdownSection
                      title={`Hello, ${user.username}`}
                      showDivider
                    >
                      <DropdownItem
                        textValue='profile'
                        onClick={() => router.push(Routes.PROFILE as string)}
                      >
                        My Profile
                      </DropdownItem>
                      <DropdownItem
                        textValue='settings'
                        onClick={() => router.push(Routes.SETTINGS as string)}
                      >
                        Settings
                      </DropdownItem>
                    </DropdownSection>
                    <DropdownItem
                      textValue='logout'
                      color='danger'
                      className='text-danger'
                      onPress={handleLogout}
                    >
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Popover
                  showArrow
                  offset={16}
                  isOpen={authOpen}
                  onOpenChange={(open) => setAuthOpen(open)}
                  onClose={() => {
                    setAuthTab('login');
                    setAuthInput({ username: '', password: '', confirmPassword: '', email: '' });
                    setAuthError({ username: '', password: '', confirmPassword: '', form: '', email: '' });
                  }}
                >
                  <PopoverTrigger>
                    <Button
                      variant='flat'
                      color='primary'
                    >
                      Sign in
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-[320px]'>
                    {(popoverTitle) => (
                      <div className='flex w-full flex-col gap-2'>
                        <div className='relative flex w-full flex-col gap-2 overflow-hidden'>
                          <div
                            className={twMerge(
                              'relative grid w-[200%] grid-cols-2 gap-y-2 transition duration-250',
                              authTab === 'login' && 'translate-x-0',
                              authTab === 'register' && '-translate-x-1/2',
                            )}
                          >
                            <motion.form
                              initial={{ height: 'fit-content' }}
                              animate={{
                                height: authTab === 'login' ? 'fit-content' : 'fit-content',
                                opacity: authTab === 'login' ? 1 : 0,
                              }}
                              transition={{
                                duration: authTab === 'login' ? 0 : 0.25,
                                ease: 'easeInOut',
                              }}
                              className={twMerge('flex w-full flex-col gap-2 overflow-hidden p-2')}
                              onSubmit={handleLogin}
                            >
                              <span
                                className='flex items-center gap-2 text-large font-bold'
                                {...popoverTitle}
                              >
                                <Icon name='LogIn' />
                                <span>Login</span>
                              </span>
                              <div className='flex flex-col gap-2'>
                                <Input
                                  label='Username'
                                  autoComplete='off'
                                  autoFocus
                                  variant='bordered'
                                  size='sm'
                                  value={authInput.username}
                                  onChange={(e) => setAuthInput({ ...authInput, username: e.target.value })}
                                  isInvalid={!!authError.username}
                                  errorMessage={authError.username}
                                />
                                <Input
                                  label='Password'
                                  autoComplete='current-password'
                                  type='password'
                                  variant='bordered'
                                  size='sm'
                                  minLength={8}
                                  value={authInput.password}
                                  onChange={(e) => setAuthInput({ ...authInput, password: e.target.value })}
                                  isInvalid={!!authError.password}
                                  errorMessage={authError.password}
                                />

                                <Button
                                  type='submit'
                                  variant='shadow'
                                  color='primary'
                                  isLoading={authState === 'loading'}
                                >
                                  Login
                                </Button>
                              </div>
                              {authError.form && (
                                <span className='text-center text-tiny text-danger'>{authError.form}</span>
                              )}
                              <div className='mt-2 flex items-center justify-between gap-4'>
                                <NextUILink
                                  as={Link}
                                  href={Routes.FORGOT_PASSWORD}
                                  className='text-tiny'
                                >
                                  Forgot password?
                                </NextUILink>
                                <span
                                  className='relative inline-flex cursor-pointer items-center text-tiny text-primary no-underline outline-none transition-opacity tap-highlight-transparent hover:opacity-80 active:opacity-disabled data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-offset-2 data-[focus-visible=true]:outline-focus'
                                  onClick={() => setAuthTab('register')}
                                >
                                  Register new account
                                </span>
                              </div>
                            </motion.form>

                            <motion.form
                              initial={{ height: 'fit-content' }}
                              animate={{
                                height: authTab === 'register' ? 'fit-content' : 0,
                                opacity: authTab === 'register' ? 1 : 0,
                              }}
                              transition={{
                                duration: 0.4,
                                ease: 'easeInOut',
                              }}
                              className={twMerge('flex w-full flex-col gap-2 overflow-hidden p-2')}
                              onSubmit={handleRegister}
                            >
                              <span
                                className='flex items-center gap-2 text-large font-bold'
                                {...popoverTitle}
                              >
                                <Icon
                                  name='ChevronLeft'
                                  onClick={() => setAuthTab('login')}
                                  className='cursor-pointer rounded-full transition hover:bg-content2'
                                />
                                <span>Register</span>
                              </span>
                              <div className='flex flex-col gap-2'>
                                <Input
                                  label='Email'
                                  autoComplete='off'
                                  autoFocus
                                  variant='bordered'
                                  size='sm'
                                  description='We will send you a confirmation email'
                                  value={authInput.email}
                                  onChange={(e) => setAuthInput({ ...authInput, email: e.target.value })}
                                  isInvalid={!!authError.email}
                                  errorMessage={authError.email}
                                />
                                <Input
                                  label='Username'
                                  autoComplete='off'
                                  autoFocus
                                  variant='bordered'
                                  size='sm'
                                  value={authInput.username}
                                  onChange={(e) => setAuthInput({ ...authInput, username: e.target.value })}
                                  isInvalid={!!authError.username}
                                  errorMessage={authError.username}
                                />
                                <Input
                                  label='Password'
                                  autoComplete='current-password'
                                  type='password'
                                  variant='bordered'
                                  size='sm'
                                  minLength={8}
                                  value={authInput.password}
                                  onChange={(e) => setAuthInput({ ...authInput, password: e.target.value })}
                                  isInvalid={!!authError.password}
                                  errorMessage={authError.password}
                                />
                                <Input
                                  label='Confirm Password'
                                  autoComplete='confirm-password'
                                  type='password'
                                  variant='bordered'
                                  size='sm'
                                  minLength={8}
                                  value={authInput.confirmPassword}
                                  onChange={(e) => setAuthInput({ ...authInput, confirmPassword: e.target.value })}
                                  isInvalid={!!authError.confirmPassword}
                                  errorMessage={authError.confirmPassword}
                                />

                                <Button
                                  type='submit'
                                  variant='shadow'
                                  color='primary'
                                  isLoading={authState === 'loading'}
                                >
                                  Register
                                </Button>
                              </div>
                              {authError.form && (
                                <span className='text-center text-tiny text-danger'>{authError.form}</span>
                              )}
                              <div className='mt-2 flex items-center justify-between gap-4'>
                                <span className='text-tiny text-default-400'>
                                  By registering, you agree to our{' '}
                                  <NextUILink
                                    as={Link}
                                    href={Routes.TOS}
                                    className='text-tiny'
                                  >
                                    Terms of Service
                                  </NextUILink>
                                  .
                                </span>
                              </div>
                            </motion.form>
                          </div>
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        animate={{
          opacity: mobileMenuExtended ? 1 : 0,
          x: mobileMenuExtended ? '0%' : '-100%',
        }}
        transition={{
          duration: 0.25,
          ease: 'easeInOut',
          delay: mobileMenuExtended ? 0 : 0.075,
        }}
        className={twMerge(
          'absolute top-0 z-30 h-screen w-screen bg-gradient-to-r from-background/75 to-transparent backdrop-blur-sm',
        )}
        onClick={() => setMobileMenuExtended(false)}
      >
        <div
          className={'absolute top-16 z-40 flex h-fit max-h-[90vh] w-full flex-grow-0 flex-col gap-4 px-2 pt-4'}
          onClick={(e) => e.stopPropagation()}
        >
          <Accordion
            defaultExpandedKeys={['nav', 'support']}
            selectionMode='multiple'
          >
            <AccordionItem
              key='nav'
              title='Navigation'
              aria-label='Navigation'
            >
              {routes.map((route) => (
                <NextUILink
                  as={Link}
                  key={route.name}
                  href={route.href}
                  isExternal={route.external}
                  showAnchorIcon={route.external}
                  color='foreground'
                  className={twMerge(
                    'w-full px-4 py-4 transition-all duration-150',
                    router.asPath === route.href
                      ? 'bg-gradient-to-r from-primary/25 to-transparent pl-8 font-bold'
                      : 'font-normal',
                  )}
                >
                  {route.name}
                </NextUILink>
              ))}
            </AccordionItem>
            <AccordionItem
              key='support'
              title='Support me'
              aria-label='Support me'
            >
              {supports.map((support) => (
                <NextUILink
                  key={support.url}
                  href={support.url}
                  isExternal
                  color='foreground'
                  className={twMerge('w-full px-4 py-4')}
                >
                  {support.name}
                </NextUILink>
              ))}
            </AccordionItem>
          </Accordion>
          <div className='hidden flex-col gap-2'>
            <span className='px-2 text-small font-bold'>Navigation</span>
            <ul className='flex w-full flex-col'>
              {routes.map((route) => (
                <li key={route.name}>
                  <NextUILink
                    as={Link}
                    href={route.href}
                    isExternal={route.external}
                    showAnchorIcon={route.external}
                    color='foreground'
                    className={twMerge(
                      'w-full px-4 py-4 transition-all duration-150',
                      router.asPath === route.href
                        ? 'bg-gradient-to-r from-primary/25 to-transparent pl-8 font-bold'
                        : 'font-normal',
                    )}
                  >
                    {route.name}
                  </NextUILink>
                </li>
              ))}
            </ul>
          </div>
          <div className='hidden flex-col gap-2'>
            <span className='px-2 text-small font-bold'>Support me</span>
            <ul className='flex w-full flex-col'>
              {supports.map((support) => (
                <li key={support.url}>
                  <NextUILink
                    href={support.url}
                    isExternal
                    color='foreground'
                    className={twMerge('w-full px-4 py-4')}
                  >
                    {support.name}
                  </NextUILink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
