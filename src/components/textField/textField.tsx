'use client';

import { IconProps } from '@/interfaces/iconProps';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import InputMask from 'react-input-mask';
import { twMerge } from 'tailwind-merge';

interface TextFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	register?: any;
	placeholder?: string;
	variant?: 'contained' | 'outlined';
	size?: 'sm' | 'lg';
	type?: string;
	mask?: string;
	id?: string;
	className?: string;
	ornament?: IconProps;
	ornamentPosition?: 'left' | 'right';
}

export default function TextField({
	placeholder,
	variant,
	size,
	mask,
	type,
	register,
	id,
	className,
	ornament: Ornament,
	ornamentPosition,
	...props
}: TextFieldProps) {
	const variants = cva(`w-full bg-transparent outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50`, {
		variants: {
			variant: {
				outlined: 'border-b-2 border-slate-200 outline-none focus-visible:border-b-slate-300 ',
				contained:
					'focus-visible:outline-accent [&:hover:not(:focus)]:bg-accent/5 outline-input text-textField-foreground hover:border-accent rounded-lg',
			},
			size: {
				sm: 'px-1 py-1',
				lg: 'px-3 py-3',
			},
		},
		defaultVariants: {
			variant: 'contained',
			size: 'lg',
		},
	});
	const inputElement = (
		<input
			className={cn(variants({ variant, size }), ornamentPosition === 'left' ? 'pl-8' : 'pr-8', className)}
			type={type}
			id={id}
			min={0}
			placeholder={placeholder}
			{...register}
			{...props}
		/>
	);

	return (
		<div className='relative'>
			{mask ? (
				<InputMask mask={mask} maskChar={null} {...register}>
					{() => inputElement}
				</InputMask>
			) : (
				inputElement
			)}
			{Ornament && (
				<Ornament className={twMerge('absolute top-1/2 -translate-y-1/2', ornamentPosition === 'left' ? 'left-2' : 'right-4')} size={18} />
			)}
		</div>
	);
}
