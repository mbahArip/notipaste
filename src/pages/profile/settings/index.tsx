import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from '@nextui-org/react';
import { Routes } from 'constant';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ContentLayout from 'components/Layout/ContentLayout';
import Icon from 'components/Shared/Icon';

import { useAuth } from 'contexts/auth';
import pb from 'utils/pocketbase';

import { LoadingState } from 'types/Helpers';

export default function ProfileSettingsPage() {
  return (
    <ContentLayout
      seo={{
        title: 'Settings',
      }}
    >
      <Card className='w-full tablet:max-w-screen-md'>
        <CardHeader>
          <h3>Settings</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <Personalization />
        </CardBody>
      </Card>
    </ContentLayout>
  );
}

function Personalization() {
  const { user, setUserData } = useAuth();

  const [submitState, setSubmitState] = useState<LoadingState>('disabled');
  const [userInputs, setUserInputs] = useState<{
    username: string;
    email: string;
    avatar: string;
  }>({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  const [avatarInputRef, setAvatarInputRef] = useState<HTMLInputElement | null>(null);
  const [avatarState, setAvatarState] = useState<LoadingState>('idle');
  const deleteModal = useDisclosure();

  useEffect(() => {
    setUserInputs((prev) => ({
      ...prev,
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    }));
  }, [user]);

  useEffect(() => {
    const isUsernameChanged = userInputs?.username !== user?.username;

    if (isUsernameChanged) {
      setSubmitState('idle');
    } else {
      setSubmitState('disabled');
    }

    // eslint-disable-next-line
  }, [userInputs]);

  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error('You must be logged in to upload an avatar');
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }
    setAvatarState('loading');
    let fileB64: string = URL.createObjectURL(file);
    if (file.size > 1024 * 1024 * 1) {
      // Resize the image and make it smaller
      const compressImage = async (file: File) => {
        const promise = new Promise((resolve, reject) => {
          const reader = new Image();
          reader.src = URL.createObjectURL(file);
          reader.onload = () => {
            const elem = document.createElement('canvas');
            const width = 512;
            const scaleFactor = width / reader.width;
            elem.width = width;
            elem.height = reader.height * scaleFactor;
            const ctx = elem.getContext('2d');
            ctx?.drawImage(reader, 0, 0, width, reader.height * scaleFactor);
            const data = ctx?.canvas.toDataURL(file.type, 75) || '';
            resolve(data);
          };
          reader.onerror = (error) => reject(error);
        });
        return (await promise) as string;
      };
      fileB64 = await compressImage(file);
    }

    const avatarFile = await fetch(fileB64).then((res) => res.blob());
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const update = await pb.collection('notipaste_user').update(user?.id, formData as any);

      setUserData({
        ...user,
        avatar: update.avatar as string,
      });
      toast.success('Avatar updated');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setAvatarState('idle');
    }
  };
  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast.error('You must be logged in to update profile');
      return;
    }

    setSubmitState('loading');
    try {
      const formData = new FormData();
      formData.append('username', userInputs.username);
      const update = await pb.collection('notipaste_user').update(user?.id, formData as any);

      setUserData({
        ...user,
        username: update.username as string,
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitState('idle');
    }
  };

  return (
    <>
      <form
        className='grid w-full grid-cols-1 place-items-center tablet:grid-cols-4'
        onSubmit={handleUpdateUser}
      >
        <div className='flex flex-col items-center justify-center gap-4 py-2'>
          <Button
            isIconOnly
            className='relative h-24 w-24 tablet:h-32 tablet:w-32'
            radius='full'
            isDisabled={avatarState === 'loading'}
            onPress={() => {
              if (avatarState === 'idle') avatarInputRef?.click();
            }}
          >
            <Skeleton isLoaded={avatarState === 'idle'}>
              <div className='absolute z-50 grid h-full w-full place-items-center rounded-full bg-background/50 opacity-0 transition hover:opacity-100'>
                <Icon
                  name='Camera'
                  size='xl'
                />
              </div>
              <Avatar
                src={userInputs?.avatar}
                classNames={{
                  base: 'w-24 h-24 tablet:w-32 tablet:h-32',
                }}
              />
            </Skeleton>
            <input
              ref={setAvatarInputRef}
              type='file'
              hidden
              accept='image/*'
              onChange={handleUploadAvatar}
            />
          </Button>
        </div>
        <div className='grid w-full grid-cols-1 gap-2 tablet:col-span-3 tablet:grid-cols-3'>
          <Input
            variant='underlined'
            label='Username'
            className='col-span-full'
            value={userInputs?.username || ''}
            onChange={(event) => setUserInputs((prev) => ({ ...prev, username: event.target.value }))}
          />
          <Input
            variant='underlined'
            label='Email'
            isReadOnly
            isDisabled
            description={'Contact me on Discord to change your email.'}
            className='col-span-full'
            value={userInputs?.email || ''}
          />
        </div>
        <div className='col-span-full mt-8 flex w-full flex-col-reverse gap-2 tablet:flex-row tablet:justify-between'>
          <Button
            variant='shadow'
            color='danger'
            className='mt-4 tablet:mt-auto'
            onPress={deleteModal.onOpenChange}
          >
            Delete Account
          </Button>
          <div className='flex w-full flex-col-reverse items-center gap-2 tablet:flex-row tablet:justify-end'>
            <Button
              as={Link}
              href={Routes.PROFILE}
              variant='faded'
              color='danger'
              className='w-full tablet:w-fit'
            >
              Cancel
            </Button>

            <Button
              type='submit'
              variant='shadow'
              color='primary'
              className='w-full tablet:w-fit'
              isDisabled={submitState === 'disabled'}
              isLoading={submitState === 'loading'}
            >
              Save
            </Button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
      >
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalBody>Are you sure you want to delete your account? This action is irreversible.</ModalBody>
          <ModalFooter>
            <Button
              variant='flat'
              color='primary'
              onClick={deleteModal.onOpenChange}
            >
              Cancel
            </Button>
            <Button
              variant='shadow'
              color='danger'
              onClick={deleteModal.onOpenChange}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
