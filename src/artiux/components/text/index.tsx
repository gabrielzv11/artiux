import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { ComponentPropsWithoutRef, ElementType } from 'react';

export type TextComponent =
	'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'subtitle-1' | 'subtitle-2' | 'body' | 'description-1' | 'description-2' | 'action' | 'caption';

export interface TextProps extends ComponentPropsWithoutRef<'p'> {
	typography?: TextComponent;
}

export const textVariants = cva('', {
	variants: {
		typography: {
			h1: 'text-2xl font-bold',
			h2: 'text-2xl font-semibold',
			h3: 'text-xl font-semibold',
			h4: 'text-base font-semibold',
			h5: 'text-xs font-medium',
			'subtitle-1': 'text-lg font-medium',
			'subtitle-2': 'text-base font-medium',
			body: 'text-base font-normal',
			'description-1': 'text-sm font-normal',
			'description-2': 'text-xs font-normal',
			action: 'text-base font-semibold tracking-wider',
			caption: 'text-base font-medium',
		},
	},
	defaultVariants: {
		typography: 'body',
	},
});

const tagMap: Record<TextComponent, ElementType> = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	'subtitle-1': 'h6',
	'subtitle-2': 'h6',
	body: 'p',
	'description-1': 'p',
	'description-2': 'p',
	action: 'span',
	caption: 'small',
};

export function Text({ typography = 'body', className, ...props }: TextProps) {
	const Component = tagMap[typography] as 'p';

	return <Component {...props} className={cn(textVariants({ typography: typography }), className)} />;
}
