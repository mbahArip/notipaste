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
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import useTheme from 'next-theme';
import { RecordModel } from 'pocketbase';
import { Key, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import Editor from 'components/Editor';
import ContentLayout from 'components/Layout/ContentLayout';
import Icon from 'components/Shared/Icon';

import copyText from 'utils/copyText';
import { decryptData, encryptData } from 'utils/encryptionHelper';
import formatDate from 'utils/formatDate';
import pb from 'utils/pocketbase';
import relativeDate from 'utils/relativeDate';
import shareUrl from 'utils/shareUrl';

import { NotipasteBinResponse, NotipasteUserResponse } from 'types/Database';
import { LoadingState } from 'types/Helpers';

interface PastePageProps {
  paste: NotipasteBinResponse;
  owner: NotipasteUserResponse;
  isOwner: boolean;
  expiresIn?: string | null;
}
export default function PastePage({ paste, owner, isOwner, expiresIn }: PastePageProps) {
  const { theme } = useTheme();
  const [isProtected, setIsProtected] = useState<boolean>(() => {
    return !!paste.password && !isOwner;
  });
  const [passwordState, setPasswordState] = useState<LoadingState>('disabled');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const [reportState, setReportState] = useState<LoadingState>('disabled');
  const [reportReason, setReportReason] = useState<Key[]>([...new Set(['illegal'])]);
  const [reportOther, setReportOther] = useState<string>('');
  const [reportFeedback, setReportFeedback] = useState<string>('');
  const reportModal = useDisclosure();

  useEffect(() => {
    setPasswordError('');
    if (password.length) {
      setPasswordState('idle');
    } else {
      setPasswordState('disabled');
    }
  }, [password]);
  useEffect(() => {
    if (!isProtected && !isOwner) {
      const dateToken = encryptData(new Date().toISOString());
      axios
        .post('/api/internal/paste/increment-view', {
          token: dateToken,
          pasteId: paste.id,
        })
        .catch(console.error);
    }

    // eslint-disable-next-line
  }, [isProtected, isOwner]);

  useEffect(() => {
    if (reportReason[0] === 'other' && !reportOther) {
      setReportState('disabled');
    } else {
      setReportState('idle');
    }
  }, [reportReason, reportOther]);

  const handleUnlock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!paste.password) return;

    setPasswordState('loading');
    try {
      const valid = await axios
        .post('/api/internal/paste/check-password', {
          password,
          hash: paste.password,
        })
        .then((res) => res.data);
      if (!valid.data) throw new Error('Invalid password');

      setIsProtected(false);
      toast.success('Paste unlocked');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setPasswordError(error.message);
    } finally {
      setPasswordState('idle');
    }
  };

  const handleReport = async () => {
    setReportState('loading');

    try {
      if (reportReason[0] === 'other' && !reportOther)
        throw new Error('Please describe the reason why you reporting this paste.');

      await pb.collection('notipaste_reports').create({
        paste: paste.id,
        reason: reportReason[0] === 'other' && reportOther ? reportOther : (reportReason[0] as string),
        reporter: reportFeedback,
      });

      toast.success('Report submitted');
      reportModal.onClose();
      setReportReason([...new Set(['illegal'])]);
      setReportOther('');
      setReportFeedback('');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setReportState('idle');
    }
  };

  return (
    <ContentLayout
      seo={{
        title: `${paste.title}${paste.password ? ' (Protected)' : ''}`,
        description: paste.description ?? undefined,
      }}
    >
      {isProtected ? (
        <Card
          classNames={{
            base: 'max-w-screen-md',
          }}
        >
          <CardHeader>
            <h3>Protected paste</h3>
          </CardHeader>
          <Divider />
          <CardBody className='gap-2'>
            <p>This paste is protected by password. Please enter the password to view this paste.</p>
            <form
              className='flex w-full flex-col gap-2'
              onSubmit={handleUnlock}
            >
              <Input
                label='Password'
                autoComplete='off'
                type='password'
                autoFocus
                variant='bordered'
                size='sm'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!passwordError}
                errorMessage={passwordError}
              />
              <Button
                type='submit'
                variant='shadow'
                color='primary'
                isDisabled={passwordState === 'disabled'}
                isLoading={passwordState === 'loading'}
              >
                Reset Password
              </Button>
            </form>
          </CardBody>
        </Card>
      ) : (
        <div className='flex w-full flex-grow flex-col gap-4'>
          <Card>
            <CardHeader className='items-end justify-between'>
              <h3 className='line-clamp-1 w-full'>{paste.title}</h3>
              <Button
                size='sm'
                variant='light'
                color='danger'
                startContent={
                  <Icon
                    name='AlertTriangle'
                    size='xs'
                  />
                }
                onPress={reportModal.onOpen}
              >
                Report paste
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className='h-full min-h-[10vh] overflow-visible py-4'>
              <Editor
                data={[]}
                onChange={() => {}}
                render={true}
                renderValue={JSON.parse(decryptData(paste.encrypted_content))}
              />
            </CardBody>
            <Divider />
            <CardFooter className='flex-col items-center gap-2'>
              <span className='text-small font-semibold'>Share this paste</span>
              <div className='flex items-center justify-end gap-2'>
                <Button
                  variant='light'
                  isIconOnly
                  size='sm'
                  radius='full'
                  onPress={() => {
                    const url = shareUrl('facebook', `/paste/${paste.id}`);
                    window.open(url, '_blank');
                  }}
                >
                  <Image
                    src='/img/social/facebook.svg'
                    alt='Facebook'
                    removeWrapper
                    width={24}
                    height={24}
                    radius='none'
                  />
                </Button>
                <Button
                  variant='light'
                  isIconOnly
                  size='sm'
                  radius='full'
                  onPress={() => {
                    const url = shareUrl('twitter', `/paste/${paste.id}`);
                    window.open(url, '_blank');
                  }}
                >
                  <Image
                    src='/img/social/x.svg'
                    alt='Twitter / X'
                    removeWrapper
                    width={16}
                    height={16}
                    className={twMerge('object-contain', theme === 'dark' && 'invert')}
                    radius='none'
                  />
                </Button>
                <Button
                  variant='light'
                  isIconOnly
                  size='sm'
                  radius='full'
                  onPress={() => {
                    const url = shareUrl('email', `/paste/${paste.id}`);
                    window.open(url, '_blank');
                  }}
                >
                  <Icon name='Mail' />
                </Button>
                <Button
                  variant='light'
                  isIconOnly
                  size='sm'
                  radius='full'
                  onPress={() => {
                    const url = new URL(`/paste/${paste.id}`, process.env.NEXT_PUBLIC_VERCEL_URL);
                    copyText(url.toString());
                  }}
                >
                  <Icon name='Copy' />
                </Button>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h3>Paste information</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table
                removeWrapper
                hideHeader
                aria-label='Paste information'
              >
                <TableHeader>
                  <TableColumn>Key</TableColumn>
                  <TableColumn>Value</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key={'author'}>
                    <TableCell className='font-bold'>Writer</TableCell>
                    <TableCell>{paste.author ? owner.username : 'Guest'}</TableCell>
                  </TableRow>
                  <TableRow key={'description'}>
                    <TableCell className='font-bold'>Description</TableCell>
                    <TableCell>{paste.description ? paste.description : 'No description'}</TableCell>
                  </TableRow>
                  <TableRow key={'view'}>
                    <TableCell className='font-bold'>Views</TableCell>
                    <TableCell>{paste.views}</TableCell>
                  </TableRow>
                  <TableRow key={'created'}>
                    <TableCell className='font-bold'>Created at</TableCell>
                    <TableCell>{formatDate(paste.created)}</TableCell>
                  </TableRow>
                  <TableRow key={'updated'}>
                    <TableCell className='font-bold'>Last updated</TableCell>
                    <TableCell>{formatDate(paste.updated)}</TableCell>
                  </TableRow>
                  <TableRow
                    key={'expires'}
                    className={!expiresIn ? 'hidden' : ''}
                  >
                    <TableCell className='font-bold'>Expires in</TableCell>
                    <TableCell>{expiresIn ?? '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      )}

      <Modal
        isOpen={reportModal.isOpen}
        onOpenChange={reportModal.onOpenChange}
        classNames={{
          base: 'max-w-screen-md',
        }}
        onClose={() => {
          setReportReason([...new Set(['illegal'])]);
          setReportOther('');
          setReportFeedback('');
        }}
      >
        <ModalContent>
          <ModalHeader className='flex items-center gap-2'>
            <Icon
              name='AlertTriangle'
              size='lg'
              className='text-danger'
            />
            <h3>Report this paste</h3>
          </ModalHeader>
          <Divider />
          <ModalBody>
            <p>Please select the reason why you want to report this paste.</p>
            <Select
              label='Report reason'
              aria-label='Select report reason'
              selectedKeys={reportReason}
              onSelectionChange={(e) => {
                const key = [...e][0];
                setReportReason([key]);
              }}
              selectionMode='single'
            >
              <SelectItem
                key='illegal'
                description={'(ex: Hate speech, child porn, threats, etc.)'}
              >
                Illegal content
              </SelectItem>
              <SelectItem
                key='self-harm'
                description={'(ex: Self-harm, suicide, etc.)'}
              >
                Promoting harmful action
              </SelectItem>
              <SelectItem
                key='spam'
                description={
                  '(ex: Promoting a product, service, website, or any content that is considered spam as the main content of the paste.)'
                }
              >
                Spam or Advertising
              </SelectItem>
              <SelectItem
                key={'doxxing'}
                description={'(ex: Sharing someone private information.)'}
              >
                Doxxing
              </SelectItem>
              <SelectItem key='other'>Other</SelectItem>
            </Select>
            {[...reportReason][0] === 'other' && (
              <Textarea
                label='Reason'
                placeholder={'Describe the reason why you reporting this paste...'}
                value={reportOther}
                onChange={(e) => setReportOther(e.target.value)}
              />
            )}
            <Input
              type='email'
              label='Email'
              placeholder='This is optional, but we will send you an update about your report.'
              value={reportFeedback}
              onChange={(e) => setReportFeedback(e.target.value)}
            />
          </ModalBody>
          <ModalFooter className='items-center justify-between'>
            <span className='text-small  text-default-400'>
              <strong>Note:</strong> We will review your report and take action as soon as possible.
            </span>
            <div className='flex items-center gap-2'>
              <Button
                variant='faded'
                color='danger'
                onPress={() => reportModal.onClose()}
              >
                Cancel
              </Button>
              <Button
                variant='shadow'
                color='primary'
                onPress={handleReport}
                isDisabled={reportState === 'disabled'}
                isLoading={reportState === 'loading'}
              >
                Report
              </Button>
            </div>
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

  const paste = await pb.collection('notipaste_bin').getList(1, 1, {
    filter: `id = "${id}" || custom_identifier = "${id}"`,
    expand: 'author',
  });
  if (!paste.totalItems)
    return {
      notFound: true,
    };

  const data = paste.items[0];
  if (data.privacy === 'private') {
    if (!pb.authStore.isValid) {
      return {
        redirect: {
          destination: `/auth/login?redirect=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    const user = pb.authStore.model as RecordModel;
    if (user.id !== data.author) {
      return {
        notFound: true,
      };
    }
  }
  const author = (data.expand as any).author as NotipasteUserResponse;
  const expiresIn = data.expires ? relativeDate(data.expires, true) : null;

  return {
    props: {
      paste: data,
      owner: author,
      isOwner: data.author ? data.author === pb.authStore.model?.id : false,
      expiresIn,
    },
  };
}
