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

export default function LoginPage() {
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
  const handleLogin = async (e: React.FormEvent<HTMLDivElement>) => {
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
      toast.success('Logged in successfully');
      await sleep(250);
      const { redirect } = router.query;
      if (redirect) {
        router.push(redirect as string);
      } else {
        router.push(Routes.PROFILE);
      }
      setUserData(response.data.record);
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

  return (
    <ContentLayout
      seo={{
        title: 'Login',
      }}
    >
      <Card
        classNames={{
          base: 'w-full max-w-md',
        }}
      >
        <CardHeader>
          <h3>Login</h3>
        </CardHeader>
        <Divider />
        <CardBody
          as={'form'}
          className='gap-2'
          onSubmit={handleLogin}
        >
          <Input
            label='Username'
            autoComplete='off'
            autoFocus
            size='sm'
            variant='bordered'
            value={authInput.username}
            onChange={(e) => setAuthInput({ ...authInput, username: e.target.value })}
            isInvalid={!!authError.username}
            errorMessage={authError.username}
          />
          <Input
            label='Password'
            autoComplete='current-password'
            type='password'
            size='sm'
            variant='bordered'
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
          <div className='mt-2 flex w-full items-center justify-between'>
            <NextUILink
              as={Link}
              href={Routes.FORGOT_PASSWORD}
              className='text-small'
            >
              Forgot Password?
            </NextUILink>
            <NextUILink
              as={Link}
              href={Routes.REGISTER}
              className='text-small'
            >
              Register
            </NextUILink>
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
