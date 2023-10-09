import { Button, Card, CardBody, CardHeader, Divider, Input } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';

import ContentLayout from 'components/Layout/ContentLayout';

import sleep from 'utils/sleep';

import { LoadingState } from 'types/Helpers';

interface RemovePastePageProps {
  token?: string | null;
}
export default function RemovePastePage({ token }: RemovePastePageProps) {
  const router = useRouter();

  const [deleteToken, setDeleteToken] = useState<string>(token || '');
  const [deleteState, setDeleteState] = useState<LoadingState>('idle');
  const [deleteError, setDeleteError] = useState<string>('');

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deleteToken) return setDeleteError('Delete token is required');

    setDeleteState('loading');
    try {
      const response = await axios
        .post('/api/internal/paste/delete', {
          deleteToken,
        })
        .then((res) => res.data);

      setDeleteError('');
      setDeleteToken('');
      toast.success(response.message);
      await sleep(500);
      router.push('/');
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const response = error.response?.data;
        console.error(response);
        if (response) {
          setDeleteError(response.message);
          toast.error('Failed to delete paste');
        } else {
          setDeleteError('An unknown error occurred');
          toast.error('An unknown error occurred');
        }
      } else {
        console.error(error);
        setDeleteError(error.message);
        toast.error(error.message);
      }
    } finally {
      setDeleteState('idle');
    }
  };

  return (
    <ContentLayout
      seo={{
        title: 'Delete Paste',
      }}
    >
      <Card
        classNames={{
          base: 'max-w-screen-md',
        }}
      >
        <CardHeader>
          <h3>Delete My Paste</h3>
        </CardHeader>
        <Divider />
        <CardBody className='gap-2'>
          <p>Please enter your delete token to delete your paste.</p>
          <form
            className='flex w-full flex-col gap-2'
            onSubmit={handleDelete}
          >
            <Input
              label='Token'
              autoComplete='off'
              autoFocus
              variant='bordered'
              size='sm'
              value={deleteToken}
              onChange={(e) => setDeleteToken(e.target.value)}
              isInvalid={!!deleteError}
              errorMessage={deleteError}
            />
            <Button
              type='submit'
              variant='shadow'
              color='primary'
              isLoading={deleteState === 'loading'}
            >
              Delete Paste
            </Button>
          </form>
          <div className='mt-2 flex flex-col'></div>
        </CardBody>
      </Card>
    </ContentLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { token } = context.query;

  return {
    props: {
      token: token || null,
    },
  };
}
