import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Link as NextUILink,
  Skeleton,
  Tooltip,
} from '@nextui-org/react';
import { Routes } from 'constant';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import ContentLayout from 'components/Layout/ContentLayout';
import Icon from 'components/Shared/Icon';

import { useAuth } from 'contexts/auth';
import useDebounce from 'hooks/useDebounce';
import pb from 'utils/pocketbase';
import relativeDate from 'utils/relativeDate';
import relativeNumber from 'utils/relativeNumber';

import { NotipasteBinResponse } from 'types/Database';
import { LoadingState } from 'types/Helpers';

export default function ProfilePage() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  const [dataState, setDataState] = useState<LoadingState>(isLoading ? 'loading' : 'idle');
  const [userStats, setUserStats] = useState<
    {
      title: string;
      value: string | number;
    }[]
  >([
    {
      title: 'Join date',
      value: relativeDate(new Date().toISOString()),
    },
    {
      title: 'Total Views',
      value: 0,
    },
    {
      title: 'Total Pastes',
      value: 0,
    },
  ]);

  useEffect(() => {
    if (isLoading) {
      setDataState('loading');
    } else {
      setDataState('idle');
    }
  }, [isLoading]);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [moreState, setMoreState] = useState<LoadingState>('idle');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'public' | 'private'>('all');
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearchInput = useDebounce(searchInput);
  const [listState, setListState] = useState<LoadingState>('loading');
  const [list, setList] = useState<NotipasteBinResponse[]>([]);
  const [defaultList, setDefaultList] = useState<NotipasteBinResponse[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setDataState('loading');
      const pasteCollection = await pb.collection('notipaste_bin').getList(1, 0);

      setUserStats([
        {
          title: 'Join date',
          value: relativeDate(user?.created),
        },
        {
          title: 'Total Pastes',
          value: pasteCollection.totalItems,
        },
        {
          title: 'Total Views',
          value: 0,
        },
      ]);
    };
    const fetchPaste = async () => {
      setListState('loading');
      await handleFetchPaste();
    };

    const fetchAll = async () => {
      await Promise.all([fetchData(), fetchPaste()]);
    };
    fetchAll().then(() => setDataState('idle'));
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setMoreState('loading');
    handleFetchPaste();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (!user) return;
    setPage(1);
    setListState('loading');
    handleFetchPaste();
    // eslint-disable-next-line
  }, [selectedCategory]);

  useEffect(() => {
    if (!searchInput) setList(defaultList);
    // eslint-disable-next-line
  }, [searchInput]);
  useEffect(() => {
    if (!debouncedSearchInput) return;
    setPage(1);
    setListState('loading');
    handleFetchPaste();
    // eslint-disable-next-line
  }, [debouncedSearchInput]);

  const handleFetchPaste = async () => {
    if (!user) return;

    try {
      const filter: string[] = [`author = "${user.id}"`];
      if (selectedCategory !== 'all') {
        filter.push(`privacy = "${selectedCategory === 'public' ? 'public' : 'private'}"`);
      }
      if (debouncedSearchInput) {
        filter.push(`title ~ "%${debouncedSearchInput}%" || description ~ "%${debouncedSearchInput}%"`);
      }
      const pasteCollection = await pb.collection('notipaste_bin').getList(page, limit, {
        filter: filter.join(' && '),
        expand: 'author',
        sort: '-created',
      });

      // Make sure there is no duplicate paste caused by useEffect
      const uniquePaste = new Set(pasteCollection.items.map((paste) => paste.id));
      const uniquePasteList: NotipasteBinResponse[] = [...uniquePaste].map(
        (id) => pasteCollection.items.find((paste) => paste.id === id) as NotipasteBinResponse,
      );
      setList(uniquePasteList);
      if (!defaultList.length) setDefaultList(uniquePasteList);
      setIsMore(pasteCollection.page < pasteCollection.totalPages);
    } catch (error: any) {
      console.error(error);
      toast.error('An error occured while fetching your pastes');
      setList([]);
    } finally {
      setListState('idle');
      setMoreState('idle');
    }
  };

  return (
    <ContentLayout
      seo={{
        title: `My Profile`,
      }}
    >
      <div className='flex h-full w-full max-w-screen-lg flex-grow flex-col items-center justify-start'>
        <div className='relative flex w-full flex-col items-center gap-4'>
          <Skeleton
            isLoaded={dataState === 'idle'}
            classNames={{
              base: 'rounded-full',
              content: 'bg-background',
            }}
          >
            <Avatar
              src={user?.avatar}
              isBordered
              classNames={{
                base: 'w-24 h-24',
                img: 'w-24 h-24',
                name: 'text-2xl',
              }}
            />
          </Skeleton>
          <Skeleton
            isLoaded={dataState === 'idle'}
            classNames={{
              content: 'bg-background',
            }}
          >
            <h2>{user?.username}</h2>
          </Skeleton>

          <div className='grid grid-cols-3 place-items-center'>
            {userStats.map((stat) => (
              <Skeleton
                classNames={{
                  base: twMerge(dataState === 'idle' && 'border-r border-divider last-of-type:border-0'),
                  content: 'bg-background',
                }}
                isLoaded={dataState === 'idle'}
                key={stat.title}
              >
                <div className='flex flex-col items-center gap-1 border-r border-divider px-4 last-of-type:border-0 md:px-8'>
                  <span className='text-small'>{stat.title}</span>
                  <span className='text-large font-bold'>{stat.value}</span>
                </div>
              </Skeleton>
            ))}
          </div>

          <Divider />

          <ButtonGroup
            variant='shadow'
            fullWidth
            className='rounded-medium bg-content3'
          >
            <Button
              onPress={() => setSelectedCategory('all')}
              color={selectedCategory === 'all' ? 'primary' : 'default'}
            >
              All
            </Button>
            <Button
              onPress={() => setSelectedCategory('public')}
              color={selectedCategory === 'public' ? 'primary' : 'default'}
            >
              Public
            </Button>
            <Button
              onPress={() => setSelectedCategory('private')}
              color={selectedCategory === 'private' ? 'primary' : 'default'}
            >
              Private
            </Button>
          </ButtonGroup>

          <Input
            variant='bordered'
            label='Search'
            placeholder='Search paste by title'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            isClearable
            onClear={() => setSearchInput('')}
          />

          <div className='grid w-full grid-cols-1 gap-4 tablet:grid-cols-2'>
            {listState === 'loading' ? (
              <>
                {Array.from({ length: 2 })
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      classNames={{
                        content: 'bg-background',
                      }}
                    >
                      <Card
                        isPressable
                        isHoverable
                      >
                        <CardBody className='relative gap-2'>
                          <h4>Placeholder</h4>
                          <span className='line-clamp-2 text-small text-default-400'>Placeholder</span>
                        </CardBody>
                        <CardFooter>
                          <div className='flex items-center gap-4 text-tiny text-default-400'>Placeholder</div>
                        </CardFooter>
                      </Card>
                    </Skeleton>
                  ))}
              </>
            ) : (
              <>
                {list.length === 0 ? (
                  <span className='col-span-full py-8 text-center text-large text-default-400'>
                    You don&apos;t have any paste yet,{' '}
                    <NextUILink
                      as={Link}
                      href={Routes.NEW_PASTE as string}
                      className='text-large'
                    >
                      create one now
                    </NextUILink>
                    !
                  </span>
                ) : (
                  <>
                    {list.map((paste) => (
                      <Card
                        key={paste.id}
                        as={Link}
                        href={`/paste/${paste.custom_identifier || paste.id}`}
                        isPressable
                        isHoverable
                      >
                        <CardBody className='relative gap-2'>
                          <div className='flex items-center gap-2'>
                            <h4 className='line-clamp-1'>{paste.title}</h4>
                            {paste.password && (
                              <Tooltip content='This paste is password protected'>
                                <Icon
                                  name='KeyRound'
                                  size='xs'
                                  className='text-default-400'
                                />
                              </Tooltip>
                            )}
                          </div>
                          <span className='line-clamp-2 text-small text-default-400'>
                            {paste.description || 'No description'}
                          </span>
                        </CardBody>
                        <CardFooter className='flex-col'>
                          <div className='grid w-full grid-cols-3 place-items-center text-tiny text-default-400'>
                            <Tooltip
                              placement='bottom'
                              content={
                                paste.privacy === 'public'
                                  ? 'Anyone with the link can view this paste'
                                  : 'Only you can view this paste'
                              }
                            >
                              <div className='flex items-center gap-1'>
                                <Icon
                                  name={paste.privacy === 'public' ? 'Globe' : 'Lock'}
                                  size='xs'
                                />
                                <span>{paste.privacy === 'public' ? 'Public' : 'Private'}</span>
                              </div>
                            </Tooltip>
                            <Tooltip
                              placement='bottom'
                              content={`${paste.views} ${paste.views > 1 ? 'views' : 'view'}`}
                            >
                              <div className='flex items-center gap-1'>
                                <Icon
                                  name='Eye'
                                  size='xs'
                                />
                                <span>{relativeNumber(paste.views)}</span>
                              </div>
                            </Tooltip>
                            <Tooltip
                              placement='bottom'
                              content={`Created at ${new Date(paste.created).toLocaleDateString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                                hourCycle: 'h23',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}`}
                            >
                              <div className='flex items-center gap-1'>
                                <Icon
                                  name='Timer'
                                  size='xs'
                                />
                                <span>{relativeDate(new Date(paste.created).toISOString())}</span>
                              </div>
                            </Tooltip>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                    {isMore && (
                      <Button
                        className='col-span-full'
                        fullWidth
                        isLoading={moreState === 'loading'}
                        onPress={() => setPage(page + 1)}
                      >
                        Load more...
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const authCookie = context.req.cookies;
  if (!authCookie['pb_auth']) {
    return {
      redirect: {
        destination: Routes.LOGIN,
        permanent: false,
      },
    };
  }
  // if (!authCookie) {
  //   return {
  //     redirect: {
  //       destination: Routes.LOGIN,
  //       permanent: false,
  //     },
  //   };
  // }

  // pb.authStore.loadFromCookie(authCookie, 'pb_auth');
  // if (!pb.authStore.isValid) {
  //   context.res.setHeader('Set-Cookie', 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
  //   return {
  //     redirect: {
  //       destination: Routes.LOGIN,
  //       permanent: false,
  //     },
  //   };
  // }
  // await pb.collection('notipaste_user').authRefresh();

  return {
    props: {},
  };
}
