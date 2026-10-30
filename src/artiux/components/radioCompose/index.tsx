import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/artiux/components/button';
import { useRadioGroupAnchorRef, useRadioGroupContext, useRadioGroupItemRef } from '@/artiux/components/radioGroup';
import { textVariants } from '@/artiux/components/text';
import { motion } from 'motion/react';

export interface RadioComposeItemProps extends Omit<React.ComponentProps<'button'>, 'value'> {
	title: string;
	description?: string;
	actionName?: string;
	action?: () => void;
	value: string;
}

function RadioComposeItem({
	title,
	description,
	actionName,
	action,
	value,
	disabled,
	onClick,
	className,
	...props
}: RadioComposeItemProps) {
	const context = useRadioGroupContext('RadioComposeItem');
	const itemRef = useRadioGroupItemRef(value);
	const anchorRef = useRadioGroupAnchorRef(value);
	const checked = context.value === value;
	const itemDisabled = disabled ?? context.disabled;

	return (
		<button
			ref={itemRef}
			type='button'
			role='radio'
			aria-checked={checked}
			data-state={checked ? 'checked' : 'unchecked'}
			data-slot='radio-group-item'
			disabled={itemDisabled}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented && !itemDisabled) context.setValue(value);
			}}
			className={cn(
				'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive group flex w-full flex-col justify-center gap-2 rounded-3xl border-2 p-4 transition-[color,box-shadow,border-color] duration-200 ease-in-out outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
				'data-[state=checked]:border-primary',
				className
			)}
			{...props}
		>
			<div className='flex items-center gap-2'>
				<div
					ref={anchorRef}
					className={cn(
						'border-input flex aspect-square size-6 w-max items-center justify-center rounded-full border transition-[border-color] duration-200 ease-in-out',
						'group-data-[state=checked]:border-primary'
					)}
				>
					<span data-slot='radio-group-indicator' className='relative flex items-center justify-center'>
						{checked && (
							<motion.span
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.2, ease: 'easeInOut', type: 'spring', stiffness: 300, damping: 20 }}
								className='bg-primary absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full'
							/>
						)}
					</span>
				</div>

				<span className={cn(textVariants({ typography: 'subtitle-2' }))}>{title}</span>
			</div>
			{description && <p className={cn('text-emphasis-low text-left', textVariants({ typography: 'description-2' }))}>{description}</p>}

			{actionName && (
				<Button className='w-full' variant='secondary' size='sm' onClick={(e) => (e.stopPropagation(), action && action())}>
					{actionName}
				</Button>
			)}
		</button>
	);
}

export { RadioComposeItem };
