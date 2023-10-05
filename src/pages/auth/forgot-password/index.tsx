import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ContentLayout from 'components/Layout/ContentLayout';

import { useAuth } from 'contexts/auth';
import pb from 'utils/pocketbase';

import { LoadingState } from 'types/Helpers';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
    // eslint-disable-next-line
  }, [user]);

  const [email, setEmail] = useState<string>('');
  const [resetState, setResetState] = useState<LoadingState>('idle');
  const [resetError, setResetError] = useState<Record<'email' | 'form', string>>({
    email: '',
    form: '',
  });

  useEffect(() => {
    setResetError({ email: '', form: '' });
  }, [email]);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return setResetError({ ...resetError, email: 'Email is required' });

    setResetState('loading');
    try {
      const response = await axios.post(
        '/api/internal/auth/reset-password',
        {
          email,
        },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      toast.success(response.data.message);
      setResetError({ email: '', form: '' });
      setEmail('');
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const response = error.response?.data;
        console.error(response);
        switch (response.scope) {
          case 'email':
            setResetError({ ...resetError, email: response.message ?? response.error });
            break;
          default:
            setResetError({ ...resetError, form: response.message ?? response.error });
            break;
        }
        toast.error('Failed to reset password');
      } else {
        console.error(error);
        setResetError({ ...resetError, form: 'Something went wrong' });
        toast.error('Failed to reset password');
      }
    } finally {
      setResetState('idle');
    }
  };

  return (
    <ContentLayout
      seo={{
        title: 'Forgot Password',
      }}
    >
      <Card
        classNames={{
          base: 'max-w-screen-md',
        }}
      >
        <CardHeader>
          <h3>Forgot Password</h3>
        </CardHeader>
        <Divider />
        <CardBody className='gap-2'>
          <p>Please enter your registered email address to reset your password.</p>
          <form
            className='flex w-full flex-col gap-2'
            onSubmit={handleReset}
          >
            <Input
              label='Email'
              autoComplete='off'
              type='email'
              autoFocus
              variant='bordered'
              size='sm'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!resetError.email}
              errorMessage={resetError.email}
            />
            <Button
              type='submit'
              variant='shadow'
              color='primary'
              isLoading={resetState === 'loading'}
            >
              Reset Password
            </Button>
          </form>
          <div className='mt-2 flex flex-col'></div>
        </CardBody>
        <Divider />
        <CardFooter className='flex-col items-start'>
          <span className='text-tiny text-default-400'>
            If you don&apos;t receive an email, please check your spam folder.
          </span>
          <span className='text-tiny text-default-400'>
            If you still don&apos;t receive an email, please contact me on{' '}
            <Link
              href='https://discord.com/users/652155604172931102'
              isExternal
              className='text-tiny'
            >
              Discord
            </Link>
            .
          </span>
        </CardFooter>
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
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}
