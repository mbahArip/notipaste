import { Button, Card, CardBody, CardHeader, Divider, Input, Link as NextUILink } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { Routes } from 'constant';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ContentLayout from 'components/Layout/ContentLayout';

import { useAuth } from 'contexts/auth';
import pb from 'utils/pocketbase';
import sleep from 'utils/sleep';

import { LoadingState } from 'types/Helpers';

export default function RegisterPage() {
  const { setUserData } = useAuth();
  const router = useRouter();

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
  const handleRegister = async (e: React.FormEvent<HTMLDivElement>) => {
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
      await sleep(250);
      router.push(Routes.LOGIN);
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

  return (
    <ContentLayout
      seo={{
        title: 'Register',
      }}
    >
      <Card
        classNames={{
          base: 'w-full max-w-md',
        }}
      >
        <CardHeader>
          <h3>Register</h3>
        </CardHeader>
        <Divider />
        <CardBody
          as={'form'}
          className='gap-2'
          onSubmit={handleRegister}
        >
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
          <div className='mt-2 flex w-full items-center justify-between'>
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
        </CardBody>
      </Card>
    </ContentLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const authCookie = context.req.headers.cookie;
  if (authCookie) {
    pb.authStore.loadFromCookie(authCookie, 'pb_auth');
    if (pb.authStore.isValid) {
      return {
        redirect: {
          destination: Routes.HOME,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
