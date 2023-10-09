import { Image } from '@nextui-org/react';
import { ActionMenuRenderProps } from '@yoopta/action-menu-list';
import useTheme from 'next-theme';
import { twMerge } from 'tailwind-merge';

function ActionMenu(props: ActionMenuRenderProps) {
  const { theme } = useTheme();
  const { groups, isNotFound, getItemProps, getRootProps, items } = props;

  return (
    <div
      {...getRootProps()}
      className='relative bottom-0 left-auto right-auto z-20 flex w-auto flex-grow origin-bottom flex-col items-center rounded-medium border border-divider bg-content1 p-2 text-foreground shadow-medium tablet:-left-0'
    >
      <div className='relative left-auto right-auto flex h-full max-h-[40vh] w-[320px] min-w-[256px] max-w-[360px] flex-grow flex-col overflow-hidden overflow-y-auto tablet:w-[400px] tablet:min-w-[300px] tablet:max-w-lg'>
        {/* Text nodes */}
        {groups.texts.length > 0 && (
          <div className='flex w-full flex-col gap-2'>
            <span className='py-1 text-small text-default-500'>Text nodes</span>
            <div className='flex w-full flex-col'>
              {groups.texts.map((item) => (
                <button
                  key={item.type}
                  type='button'
                  className='flex cursor-pointer gap-4 px-2 py-2 hover:bg-primary/10 aria-selected:bg-primary/20 data-[element-active="true"]:bg-primary/10'
                  {...getItemProps(item.type)}
                >
                  <Image
                    src={(item as any).icon}
                    alt='icon'
                    removeWrapper
                    className={twMerge(
                      'h-12 w-12 flex-shrink-0 flex-grow-0 border border-divider object-cover',
                      theme === 'light' ? 'brightness-90' : 'brightness-150',
                    )}
                  />
                  <div className='flex flex-col items-start gap-0.5'>
                    <span className='font-semibold'>{(item as any).label}</span>
                    <span className='text-start text-tiny text-default-500'>{(item as any).description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Void nodes */}
        {groups.voids.length > 0 && (
          <div className='flex w-full flex-col gap-2'>
            <span className='py-1 text-small text-default-500'>Void nodes</span>
            <div className='flex w-full flex-col'>
              {groups.voids.map((item) => (
                <button
                  key={item.type}
                  type='button'
                  className='flex cursor-pointer gap-4 px-2 py-2 hover:bg-primary/10 aria-selected:bg-primary/20 data-[element-active="true"]:bg-primary/10'
                  {...getItemProps(item.type)}
                >
                  <Image
                    src={(item as any).icon}
                    alt='icon'
                    removeWrapper
                    className={twMerge(
                      'h-12 w-12 flex-shrink-0 flex-grow-0 border border-divider object-cover',
                      theme === 'light' ? 'brightness-90' : 'brightness-150',
                    )}
                  />
                  <div className='flex flex-col items-start gap-0.5'>
                    <span className='font-semibold'>{(item as any).label}</span>
                    <span className='text-start text-tiny text-default-500'>{(item as any).description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Inlines nodes */}
        {groups.inlines.length > 0 && (
          <div className='flex w-full flex-col gap-2'>
            <span className='py-1 text-small text-default-500'>Inlines nodes</span>
            <div className='flex w-full flex-col'>
              {groups.inlines.map((item) => (
                <button
                  key={item.type}
                  type='button'
                  className='flex cursor-pointer gap-4 px-2 py-2 hover:bg-primary/10 aria-selected:bg-primary/20 data-[element-active="true"]:bg-primary/10'
                  {...getItemProps(item.type)}
                >
                  <Image
                    src={(item as any).icon}
                    alt='icon'
                    removeWrapper
                    className={twMerge(
                      'h-12 w-12 flex-shrink-0 flex-grow-0 border border-divider object-cover',
                      theme === 'light' ? 'brightness-90' : 'brightness-150',
                    )}
                  />
                  <div className='flex flex-col items-start gap-0.5'>
                    <span className='font-semibold'>{(item as any).label}</span>
                    <span className='text-start text-tiny text-default-500'>{(item as any).description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Not found */}
        {isNotFound && (
          <div className='flex w-full items-center justify-center gap-2'>
            <span className='w-full text-center text-small text-default-400'>Can&apos;t find any commands</span>
          </div>
        )}
      </div>
    </div>
    // <div
    //   {...getRootProps()}
    //   className='opacity-1 relative bottom-1 left-0 flex origin-bottom flex-col items-center rounded-medium border border-divider bg-content1 text-foreground shadow-medium'
    // >
    //   <div className='relative flex h-full max-h-[40vh] w-96 min-w-[180px] max-w-[calc(100vw-24px)] flex-col overflow-hidden overflow-y-auto'>
    //     {groups.texts.length > 0 && (
    //       <div className='mt-1 py-1'>
    //         <span className='text-small text-default-400'>Text nodes</span>
    //         {groups.texts.map((item) => (
    //           <Button
    //             key={item.type}
    //             type='button'
    //             variant='light'
    //             color='primary'
    //             {...getItemProps(item)}
    //           >
    //             <span>{(item as any).group}</span>
    //             <div className='flex flex-col'>
    //               <span className='text-large font-semibold'>{(item as any).displayLabel}</span>
    //               <span className='text-default-400'>{(item as any).description}</span>
    //             </div>
    //           </Button>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}

export default ActionMenu;
