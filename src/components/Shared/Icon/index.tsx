import { LucideProps, icons } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface IconProps extends LucideProps {
  name: keyof typeof icons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Icon({ name, size = 'md', className, ...rest }: IconProps) {
  const LucideIcon = icons[name];
  const defaultSize = 20;
  const sizeMap = {
    xs: Math.round(defaultSize * 0.625),
    sm: Math.round(defaultSize * 0.75),
    md: defaultSize,
    lg: Math.round(defaultSize * 1.25),
    xl: Math.round(defaultSize * 1.5),
  };

  return (
    <LucideIcon
      size={sizeMap[size]}
      className={twMerge('flex-shrink-0 flex-grow-0 transition duration-150', className)}
      {...rest}
    />
  );
}
