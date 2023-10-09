import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Link as NextUILink,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';
import { Routes } from 'constant';
import { GetServerSidePropsContext } from 'next';
import useTheme from 'next-theme';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RecordModel } from 'pocketbase';
import { Key, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import Alert from 'components/Alert';
import Editor, { EditorValue } from 'components/Editor';
import ContentLayout from 'components/Layout/ContentLayout';
import Icon from 'components/Shared/Icon';

import { useAuth } from 'contexts/auth';
import copyText from 'utils/copyText';
import { decryptData } from 'utils/encryptionHelper';
import pb from 'utils/pocketbase';
import shareUrl from 'utils/shareUrl';

import { NotipasteBinResponse } from 'types/Database';
import { LoadingState } from 'types/Helpers';

interface EditPastePageProps {
  paste: NotipasteBinResponse;
}
export default function EditPastePage({ paste }: EditPastePageProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [publishState, setPublishState] = useState<LoadingState>('disabled');
  const [title, setTitle] = useState<string>(paste.title);
  const [value, setValue] = useState<EditorValue[]>(JSON.parse(decryptData(paste.encrypted_content)));
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [pastePrivacy, setPastePrivacy] = useState<Key[]>([...new Set([paste.privacy])]);
  const [pasteExpiration, setPasteExpiration] = useState<Key[]>(() => {
    if (!paste.expires) return [...new Set(['0'])];

    const now = new Date().getTime();
    const expiration = new Date(paste.expires).getTime();
    const dayDiff = Math.floor((expiration - now) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 0) {
      return [...new Set(['0'])];
    } else if (dayDiff <= 1) {
      return [...new Set(['1'])];
    } else if (dayDiff <= 7) {
      return [...new Set(['7'])];
    } else if (dayDiff <= 14) {
      return [...new Set(['14'])];
    } else if (dayDiff <= 30) {
      return [...new Set(['30'])];
    } else {
      return [...new Set(['0'])];
    }
  });
  const [pastePassword, setPastePassword] = useState<string>('');
  const [pasteIdentifier, setPasteIdentifier] = useState<string>(paste.custom_identifier ?? '');
  const [pasteDeleteToken] = useState<string>(paste.delete_token);
  const [pasteDescription, setPasteDescription] = useState<string>(paste.description ?? '');

  const [publishedId, setPublishedId] = useState<string>(paste.id);

  const publishedModal = useDisclosure();

  useEffect(() => {
    if (title && value.length) {
      setPublishState('idle');
    } else {
      setPublishState('disabled');
    }
  }, [title, value]);

  useEffect(() => {
    const imageElements = value.filter((v) => (v.type as any) === 'image');
    const imagesId = imageElements
      .map((v) =>
        v.data?.url && v.data?.url.includes(process.env.NEXT_PUBLIC_POCKETBASE_URL)
          ? v.data?.url.split('files/')[1].split('/')[1]
          : null,
      )
      .filter((v) => v !== null) as string[];
    setUploadedImages(imagesId);
  }, [value]);

  const handleUpdate = async () => {
    setPublishState('loading');

    try {
      if (pasteIdentifier) {
        const check = await axios
          .get(`/api/internal/paste/check-identifier?identifier=${pasteIdentifier}&pasteId=${paste.id}`)
          .then((res) => res.data);
        if (check.data) throw new Error('Identifier already taken.');
      }
      const privacy = [...pastePrivacy][0];
      const expirationDays = [...pasteExpiration][0];
      let expiration = 0;
      if (Number(expirationDays) > 0) {
        expiration = new Date().getTime() + Number(expirationDays) * 24 * 60 * 60 * 1000;
      }

      const response = await axios
        .post(
          '/api/internal/paste/update',
          {
            id: paste.id,
            title,
            content: JSON.stringify(value),
            description: pasteDescription,
            password: pastePassword,
            identifier: pasteIdentifier,
            privacy,
            deleteToken: pasteDeleteToken,
            expires: expiration > 0 ? new Date(expiration).toISOString() : undefined,
          },
          {
            headers: {
              Authorization: pb.authStore.token,
            },
          },
        )
        .then((res) => res.data);

      const pasteId = paste.id;
      // Update every attached image
      const attachmentIds = uploadedImages.join(',');
      if (attachmentIds) {
        await axios.post('/api/internal/paste/update-attachment', {
          attachmentIds,
          pasteId,
        });
      }
      toast.success('Paste updated successfully.');
      publishedModal.onOpen();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setPublishState('idle');
    }
  };

  return (
    <ContentLayout
      seo={{
        title: 'Edit Paste',
      }}
    >
      <div className='flex w-full flex-grow flex-col gap-4'>
        <Alert
          color='primary'
          icon='Info'
        >
          We will save your writing as a draft in your browser storage. It will not be saved to the server until you
          click the <strong>&quot;Save&quot;</strong> button.
        </Alert>
        <Card
          className='overflow-visible'
          classNames={{
            base: 'w-full',
          }}
        >
          <CardHeader>
            <div className='flex w-full items-center justify-between'>
              <Input
                placeholder='Enter title here...'
                variant='underlined'
                size='lg'
                value={title}
                classNames={{
                  input: 'text-2xl',
                }}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardBody className='h-full min-h-[10vh] overflow-visible py-4'>
            <Editor
              data={value}
              onChange={setValue}
              disableDraft
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h3>Options</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className='grid grid-cols-1 gap-4 tablet:grid-cols-3'>
              <Select
                label='Paste privacy'
                variant='underlined'
                aria-label='Select paste privacy'
                disallowEmptySelection
                selectedKeys={pastePrivacy}
                onSelectionChange={(keys) => setPastePrivacy([...new Set(keys)])}
                isDisabled={user === null}
                description={user === null ? "Guest can't use this feature." : ''}
              >
                <SelectItem key='public'>Public paste</SelectItem>
                <SelectItem key='private'>Private paste</SelectItem>
              </Select>
              <Input
                label='Paste password'
                placeholder='Enter password here...'
                variant='underlined'
                type='password'
                isDisabled={user === null}
                value={pastePassword}
                onChange={(e) => setPastePassword(e.target.value)}
                description={
                  user === null
                    ? "Guest can't use this feature."
                    : 'Optional. Leave blank to disable. (Only for public paste)'
                }
              />
              <Select
                label='Paste expiration'
                variant='underlined'
                aria-label='Select paste expiration'
                disallowEmptySelection
                selectedKeys={pasteExpiration}
                onSelectionChange={(keys) => setPasteExpiration([...new Set(keys)])}
                isDisabled={user === null}
                description={
                  user === null
                    ? 'Guest paste will be deleted after 14 days.'
                    : 'Automaticaly delete paste after selected time.'
                }
              >
                <SelectItem key='0'>Never</SelectItem>
                <SelectItem key='1'>1 day</SelectItem>
                <SelectItem key='7'>7 days</SelectItem>
                <SelectItem key='14'>14 days</SelectItem>
                <SelectItem key='30'>30 days</SelectItem>
              </Select>
              <Input
                label='Paste identifier'
                placeholder='Enter custom identifier here...'
                variant='underlined'
                description={'Optional. Leave blank to disable. We will force lower-case and replace spaces with dash.'}
                className='tablet:col-span-2'
                value={pasteIdentifier}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/\s+/g, '-').toLowerCase();
                  setPasteIdentifier(value);
                }}
              />
              <Input
                label='Delete token'
                variant='underlined'
                description={'Secret token to delete paste.'}
                isReadOnly
                value={pasteDeleteToken}
                endContent={
                  <Button
                    isIconOnly
                    size='sm'
                  >
                    <Icon
                      name='Copy'
                      size='sm'
                    />
                  </Button>
                }
              />
              <Textarea
                label='Paste description'
                placeholder='Enter description here...'
                variant='underlined'
                description={'Optional.'}
                className='col-span-full'
                value={pasteDescription}
                onChange={(e) => setPasteDescription(e.target.value)}
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className='flex w-full justify-end'>
              <Button
                variant='shadow'
                color='primary'
                isDisabled={publishState === 'disabled'}
                isLoading={publishState === 'loading'}
                onPress={handleUpdate}
              >
                Update
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Modal
        isOpen={publishedModal.isOpen}
        onOpenChange={publishedModal.onOpenChange}
        classNames={{
          base: 'w-full max-w-xl',
        }}
        onClose={() => {
          router.push(`/paste/${publishedId}`);
        }}
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-2'>
            <Icon
              name='CheckCircle'
              size='lg'
              className='text-primary'
            />
            <h3>Paste updated</h3>
          </ModalHeader>
          <Divider />
          <ModalBody className='w-full max-w-xl gap-2 p-4'>
            <div className='flex flex-col gap-1 rounded-medium border border-divider bg-content1 p-2'>
              <p className='text-small'>You can view your paste at:</p>
              <Input
                variant='flat'
                value={`${process.env.NEXT_PUBLIC_VERCEL_URL}/paste/${publishedId || 'publishedId'}`}
                isReadOnly
                endContent={
                  <Button
                    variant='light'
                    isIconOnly
                    size='sm'
                    onPress={() => {
                      try {
                        const url = new URL(
                          `/paste/${publishedId || 'publishedId'}`,
                          process.env.NEXT_PUBLIC_VERCEL_URL,
                        );
                        copyText(url.toString());
                      } catch (error: any) {
                        console.error(error);
                        toast.error(error.message);
                      }
                    }}
                  >
                    <Icon
                      name='Copy'
                      size='sm'
                    />
                  </Button>
                }
              />
            </div>
            {user ? (
              <p className='text-center text-small'>
                You can edit or delete this paste from your{' '}
                <NextUILink
                  as={Link}
                  href={Routes.PROFILE}
                >
                  profile page
                </NextUILink>
                .
              </p>
            ) : (
              <div className='flex flex-col gap-1 rounded-medium border border-divider bg-danger/10 p-2'>
                <p className='text-small text-danger'>You can delete your paste manually by accessing this link:</p>
                <Input
                  variant='flat'
                  color='danger'
                  value={`${process.env.NEXT_PUBLIC_VERCEL_URL}/danger-zone/paste/delete/${pasteDeleteToken}`}
                  isReadOnly
                  description='Delete link are unique for your paste. Keep it safe.'
                  endContent={
                    <Button
                      variant='light'
                      isIconOnly
                      size='sm'
                      onPress={() => {
                        try {
                          const url = new URL(
                            `/danger-zone/paste/delete/${pasteDeleteToken}`,
                            process.env.NEXT_PUBLIC_VERCEL_URL,
                          );
                          copyText(url.toString());
                        } catch (error: any) {
                          console.error(error);
                          toast.error(error.message);
                        }
                      }}
                    >
                      <Icon
                        name='Copy'
                        size='sm'
                      />
                    </Button>
                  }
                />
              </div>
            )}

            <div className='mt-4 flex flex-col gap-1 rounded-medium border border-divider bg-content1 p-2'>
              <h6>Share this paste</h6>
              <div className='mx-auto flex w-full items-center justify-center gap-2 rounded-medium bg-content2 p-2'>
                <Button
                  isIconOnly
                  variant='light'
                  size='sm'
                  radius='full'
                  onPress={() => {
                    const url = shareUrl('facebook', `/paste/${publishedId}`);
                    window.open(url, '_blank');
                  }}
                >
                  <Image
                    src='/img/social/facebook.svg'
                    alt='facebook'
                    removeWrapper
                    width={24}
                    height={24}
                    className='object-contain'
                    radius='none'
                  />
                </Button>
                <Button
                  isIconOnly
                  variant='light'
                  size='sm'
                  radius='full'
                  onPress={() => {
                    const url = shareUrl('twitter', `/paste/${publishedId}`);
                    window.open(url, '_blank');
                  }}
                >
                  <Image
                    src='/img/social/x.svg'
                    alt='X'
                    removeWrapper
                    width={16}
                    height={16}
                    className={twMerge('object-contain', theme === 'dark' && 'invert')}
                    radius='none'
                  />
                </Button>
                <Button
                  isIconOnly
                  variant='light'
                  size='sm'
                  radius='full'
                  onPress={() => {
                    const url = shareUrl('email', `/paste/${publishedId}`);
                    window.open(url, '_blank');
                  }}
                >
                  <Icon name='Mail' />
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <p className='w-full text-center text-small text-default-400'>
              You will be redirected to the paste page when you close this dialog.
            </p>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ContentLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const cookie = context.req.headers.cookie;
  if (cookie) {
    pb.authStore.loadFromCookie(cookie, 'pb_auth');
  }
  if (!pb.authStore.isValid)
    return {
      redirect: {
        destination: `/auth?redirect=${context.resolvedUrl}`,
        permanent: false,
      },
    };

  const user = pb.authStore.model as RecordModel;

  const paste = await pb.collection('notipaste_bin').getList(1, 1, {
    filter: `(id = "${id}" || custom_identifier = "${id}") && author = "${user.id}"`,
    expand: 'author',
  });
  if (!paste.totalItems)
    return {
      notFound: true,
    };

  const data = paste.items[0];

  return {
    props: {
      paste: data,
    },
  };
}
