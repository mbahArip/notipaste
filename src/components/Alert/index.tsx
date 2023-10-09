import { Button } from '@nextui-org/react';
import { icons } from 'lucide-react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import Icon from 'components/Shared/Icon';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: keyof typeof icons;
  color: 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'default';
  children: ReactNode;
  onClose?: () => void;
}
export default function Alert({ icon, color, children, onClose, ...props }: AlertProps) {
  return (
    <div
      className={twMerge(
        'flex w-full items-center justify-between gap-4 rounded-medium px-4 py-2',
        color === 'success' && 'border border-success/25 bg-success/10 text-success',
        color === 'danger' && 'border border-danger/25 bg-danger/10 text-danger',
        color === 'warning' && 'border border-warning/25 bg-warning/10 text-warning',
        color === 'primary' && 'border border-primary/25 bg-primary/10 text-primary',
        color === 'secondary' && 'border border-secondary/25 bg-secondary/10 text-secondary',
        color === 'default' && 'border border-default/25 bg-default/10 text-default-foreground',
        props.className && props.className,
      )}
      {...props}
    >
      <div className='flex items-center gap-2'>
        {icon && <Icon name={icon} />}
        <span>{children}</span>
      </div>

      {onClose && (
        <Button
          variant='light'
          color={color as 'success' | 'danger' | 'warning' | 'primary' | 'secondary' | 'default' | undefined}
          onPress={onClose}
        >
          <Icon name='X' />
        </Button>
      )}
    </div>
  );
}

Alert.defaultProps = {
  color: 'default',
};
