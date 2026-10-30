import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { type Ref, type SVGProps } from 'react';

export type { IconName };

const sizeMap = {
	xs: 12,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
} as const;

export const iconVariants = cva('select-none', {
	variants: {
		size: {
			xs: '',
			sm: '',
			md: '',
			lg: '',
			xl: '',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'>, VariantProps<typeof iconVariants> {
	icon: IconName;
	strokeWidth?: number;
	ref?: Ref<SVGSVGElement>;
}

export function Icon({ icon, size = 'md', strokeWidth, className, ref, ...props }: IconProps) {
	const fontSize = sizeMap[size ?? 'md'];

	return (
		<DynamicIcon
			{...props}
			ref={ref}
			name={icon}
			size={fontSize}
			strokeWidth={strokeWidth}
			className={cn(iconVariants({ size }), className)}
		/>
	);
}
