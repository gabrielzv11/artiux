import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import * as React from 'react';

import Image, { StaticImageData } from 'next/image';
import * as CheckboxPrimitive from 'radix-ui/checkbox';
import { Button } from '../button';
import { Icon } from '../icons';
import { textVariants } from '../text';

export interface CheckboxComposeItemProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
	title: string;
	description?: string;
	actionName?: string;
	action?: () => void;
	image?: string | StaticImageData;
	customNode?: React.ReactNode;
}

function CheckboxComposeItem({ title, description, actionName, image, customNode, action, ...props }: CheckboxComposeItemProps) {
	return (
		<>
			<CheckboxPrimitive.Root
				data-slot='checkbox'
				className={cn(
					'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive group relative flex w-full flex-col justify-center gap-2 rounded-3xl border-2 p-4 transition-[color,box-shadow,border-color] duration-200 ease-in-out outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
					'data-[state=checked]:border-primary',
					props.className
				)}
				{...props}
			>
				<div className='flex gap-2'>
					<div className='flex w-full flex-col gap-2'>
						<div className='flex items-center gap-2'>
							<div
								className={cn(
									'border-input flex aspect-square size-6 w-max items-center justify-center rounded-[8px] border transition-[border-color,background-color,color] duration-200 ease-in-out',
									'group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary group-data-[state=checked]:text-primary-foreground'
								)}
							>
								<CheckboxPrimitive.Indicator data-slot='checkbox-indicator' className='grid place-content-center'>
									<motion.span
										initial={{ scale: 0, opacity: 0, rotate: -45 }}
										animate={{ scale: 1, opacity: 1, rotate: 0 }}
										transition={{ duration: 0.25, ease: 'easeInOut', type: 'spring', stiffness: 300, damping: 20 }}
										className='grid place-content-center'
									>
										<Icon icon='check' className='size-4' />
									</motion.span>
								</CheckboxPrimitive.Indicator>
							</div>

							<span className={cn(textVariants({ typography: 'subtitle-2' }))}>{title}</span>
						</div>
						{description && (
							<p className={cn('text-emphasis-low text-left', textVariants({ typography: 'description-2' }))}>{description}</p>
						)}
					</div>

					{image && <Image className='rounded-xl' src={image} alt='title' width={44} height={44} />}
				</div>
				{actionName && (
					<Button className='w-full' variant='secondary' size='sm' onClick={(e) => (e.stopPropagation(), action && action())}>
						{actionName}
					</Button>
				)}
				<div>{customNode}</div>
			</CheckboxPrimitive.Root>
		</>
	);
}

export { CheckboxComposeItem };
