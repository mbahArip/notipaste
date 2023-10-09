import { Link as NextUILink } from '@nextui-org/react';
import ActionMenu, { ActionMenuItem } from '@yoopta/action-menu-list';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import Code from '@yoopta/code';
import YooptaEditor from '@yoopta/editor';
import Embed from '@yoopta/embed';
import File from '@yoopta/file';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import YooptaImage from '@yoopta/image';
import Link from '@yoopta/link';
import LinkTool from '@yoopta/link-tool';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import { Bold, CodeMark, Italic, Strike, Underline } from '@yoopta/marks';
import Paragraph, { ParagraphElement } from '@yoopta/paragraph';
import YooptaRenderer from '@yoopta/renderer';
import Toolbar from '@yoopta/toolbar';
import axios from 'axios';
import NextLink from 'next/link';
import { RecordModel } from 'pocketbase';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Descendant } from 'slate';

import CustomActionMenu from 'components/Editor/ActionMenu';

import generateId from 'utils/generateId';
import pb from 'utils/pocketbase';

const PLUGINS = [
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Paragraph,
  Blockquote,
  Callout.extend({
    shortcut: '>>',
  }),
  Code.extend({
    options: {
      HTMLAttributes: {
        spellCheck: false,
      },
    },
  }),
  Link.extend({
    renderer: {
      editor: (Link.getPlugin.renderer as any).editor,
      render: (props) => {
        const { element, HTMLAttributes, attributes, children } = props;
        const url = new URL(
          `/redirect?url=${encodeURIComponent(element.data.url)}`,
          process.env.NEXT_PUBLIC_VERCEL_URL,
        );

        return (
          <span
            {...attributes}
            {...HTMLAttributes}
          >
            <NextUILink
              as={NextLink}
              href={url.toString()}
            >
              {children}
            </NextUILink>
          </span>
        );
      },
    },
  }),
  NumberedList.extend({
    options: {
      HTMLAttributes: {
        className: 'list-decimal list-inside',
      },
    },
  }),
  BulletedList.extend({
    options: {
      HTMLAttributes: {
        className: 'list-disc list-inside',
      },
    },
  }),
  TodoList.extend({
    options: {},
    shortcut: '[]',
  }),
  File.extend({
    options: {
      onUpload: async (file: File) => {
        try {
          // File are not used in my instance since I don't have any file storage
          // I only allocated 128GB for my pocketbase server (which I will use for other apps, they share the same database)
          // So here are some example using discord webhook
          // (which is not recommended since there are rate-limit, but you can also implement this one to Image and Video)
          // You can try create like 5 - 10 webhook, and use them in round-robin fashion to avoid rate-limit. (I haven't tried this one)

          // Since discord have 25MB file limit, we need to check the file size first.
          if (file.size > 1024 * 1024 * 25) {
            throw new Error('File size must be less than 25MB');
          }

          const fd = new FormData();
          // Assign random id to filename
          // Output example: 3fj90Q2a-file_name.rar
          const randomId = generateId(8);
          const fileName = `${randomId}-${file.name.replaceAll(' ', '_')}`;

          fd.append('files[0]', file, fileName);

          const upload = await axios
            .post(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL as string, fd)
            .then((res) => res.data);

          // fileURL are the original file download url
          // cdnURL are the proxied url from discord, it said it have aggressive cache
          const fileURL = upload.attachments[0].url;
          const cdnURL = upload.attachments[0].proxy_url;
          return { url: fileURL || cdnURL };
        } catch (error: any) {
          console.error(error);
          toast.error(error.message);
          return { url: '' };
        }
      },
    },
  }),
  Embed.extend({
    options: {
      maxWidth: 960,
      maxHeight: 750,
    },
  }),
  YooptaImage.extend({
    options: {
      HTMLAttributes: {
        className: 'yoopta-file-image',
      },
      maxWidth: 960,
      maxHeight: 960,
      onUpload: async (file: File) => {
        try {
          const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('pb_auth='))
            ?.split('=')[1];
          if (!token) {
            throw new Error('You must be logged in to upload image');
          }
          pb.authStore.loadFromCookie(document.cookie, 'pb_auth');
          if (!pb.authStore.isValid) {
            throw new Error('You must be logged in to upload image');
          }
          const user = pb.authStore.model as RecordModel;

          // get img width and height from file
          const promise = new Promise<{ width: number; height: number }>((resolve, reject) => {
            const reader = new Image();
            reader.src = URL.createObjectURL(file);
            reader.onload = () => {
              resolve({ width: reader.width, height: reader.height });
            };
            reader.onerror = (error) => reject(error);
          });

          const { width, height } = await promise;

          const formData = new FormData();
          formData.append('file', file);
          formData.append('uploader', user.id);

          const create = await pb.collection('notipaste_attachments').create(formData as any);
          const imgUrl = pb.getFileUrl(create, create.file);
          return { url: imgUrl, width, height };
        } catch (error: any) {
          console.error(error);
          toast.error(error.message);
          return { url: '', height: 0, width: 0 };
        }
      },
    },
  }),
];

const actionItems: ActionMenuItem<Record<'label' | 'description' | 'icon', string>>[] = [
  {
    plugin: Paragraph,
    searchString: 'text paragraph',
    label: 'Paragraph',
    description: 'Start writing with plain text',
    icon: '/img/editor/text.webp',
  },
  {
    plugin: HeadingOne,
    searchString: 'h1 title large heading',
    label: 'Title',
    description: 'Main section heading',
    icon: '/img/editor/h1.webp',
  },
  {
    plugin: HeadingTwo,
    searchString: 'h2 subtitle medium heading',
    label: 'Subtitle',
    description: 'Sub section heading',
    icon: '/img/editor/h2.webp',
  },
  {
    plugin: HeadingThree,
    searchString: 'h3 subsubtitle small heading',
    label: 'Sub-subtitle',
    description: 'Small section heading',
    icon: '/img/editor/h3.webp',
  },
  {
    plugin: YooptaImage,
    searchString: 'image picture',
    label: 'Image',
    description: 'Upload image or attach by link',
    icon: '/img/editor/image.webp',
  },
  // {
  //   plugin: Video,
  //   searchString: 'video media',
  //   label: 'Video',
  //   description: 'Embed from YouTube, Vimeo, etc.',
  //   icon: '/img/editor/video.webp',
  // },
  {
    plugin: Embed,
    searchString: 'Embed media',
    label: 'Embed',
    description: 'Embed other site inside your paste',
    icon: '/img/editor/video.webp',
  },
  {
    plugin: Blockquote,
    searchString: 'blockquote quote',
    label: 'Blockquote',
    description: 'Emphasize your text with blockquote',
    icon: '/img/editor/text.webp',
  },
  {
    plugin: Callout,
    searchString: 'callout highlight',
    label: 'Callout',
    description: 'Highlight your text with callout',
    icon: '/img/editor/text.webp',
  },
  {
    plugin: Code,
    searchString: 'code',
    label: 'Code',
    description: 'Highlight your code snippert with syntax highlighting',
    icon: '/img/editor/code.webp',
  },
  {
    plugin: BulletedList,
    searchString: 'bulleted list',
    label: 'Bulleted List',
    description: 'Create unordered list with bullets',
    icon: '/img/editor/disc.webp',
  },
  {
    plugin: NumberedList,
    searchString: 'numbered list',
    label: 'NumberedList',
    description: 'Create ordered list with numbers',
    icon: '/img/editor/number.webp',
  },
  {
    plugin: TodoList,
    searchString: 'todo check list',
    label: 'TodoList',
    description: 'Checklist for your todo list',
    icon: '/img/editor/todo.webp',
  },
];

const TOOLS = {
  Toolbar: (
    <Toolbar className='yoopta-toolbar rounded-medium border border-divider bg-content2 fill-foreground text-foreground shadow-medium' />
  ),
  ActionMenu: (
    <ActionMenu
      render={CustomActionMenu}
      items={actionItems}
    />
  ),
  LinkTool: <LinkTool />,
};

export type EditorValue = ParagraphElement;

interface EditorProps {
  data: EditorValue[];
  onChange: (data: EditorValue[]) => void;
  render?: boolean;
  renderValue?: Descendant[];
  disableDraft?: boolean;
}
export default function Editor(props: EditorProps) {
  const [editorValue, setEditorValue] = useState<EditorValue[]>([]);
  const MARKS = [Bold, Italic, CodeMark, Underline, Strike];

  useEffect(() => {
    setEditorValue(props.data);
  }, [props.data]);

  return (
    <div className={`relative z-20 h-full min-h-[70vh]`}>
      {props.render && props.renderValue ? (
        <YooptaRenderer
          data={props.renderValue}
          plugins={PLUGINS}
          marks={MARKS}
          className='render'
          key={'render'}
        />
      ) : (
        <YooptaEditor<any>
          value={editorValue}
          className='pl-10'
          onChange={props.onChange}
          plugins={PLUGINS}
          tools={TOOLS}
          marks={MARKS}
          placeholder="Type '/' for commands"
          offline={props.disableDraft ? undefined : 'editor-draft'}
        />
      )}
    </div>
  );
}

Editor.defaultProps = {
  render: false,
};
