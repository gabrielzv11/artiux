import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';
import { Children, Fragment } from 'react';

const buttonGroupVariants = cva(
	"has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg flex items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
	{
		variants: {
			orientation: {
				horizontal:
					'[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
				vertical:
					'[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
			},
		},
		defaultVariants: {
			orientation: 'horizontal',
		},
	}
);

export interface ButtonGroupProps extends React.ComponentProps<'div'>, VariantProps<typeof buttonGroupVariants> {
	showSeparator?: boolean;
}

function ButtonGroup({ className, orientation = 'horizontal', showSeparator = true, children, ...props }: ButtonGroupProps) {
	const childrenArray = Children.toArray(children);

	return (
		<div
			role='group'
			data-slot='button-group'
			data-orientation={orientation}
			className={cn(buttonGroupVariants({ orientation }), className)}
			{...props}
		>
			{childrenArray.map((child, index) => {
				const isLast = index === childrenArray.length - 1;

				return (
					<Fragment key={index}>
						{child}
						{/* Insere o separador se não for o último item e showSeparator for true */}
						{!isLast && showSeparator && <ButtonGroupSeparator orientation={orientation === 'vertical' ? 'horizontal' : 'vertical'} />}
					</Fragment>
				);
			})}
		</div>
	);
}

function ButtonGroupText({
	className,
	asChild = false,
	...props
}: React.ComponentProps<'div'> & {
	asChild?: boolean;
}) {
	const Comp = asChild ? Slot.Root : 'div';

	return (
		<Comp
			className={cn(
				"bg-muted flex items-center gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	);
}

function ButtonGroupSeparator({
	className,
	orientation = 'vertical',
	...props
}: React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
	return (
		<div
			data-slot='button-group-separator'
			data-orientation={orientation}
			role='separator'
			aria-orientation={orientation}
			className={cn(
				'shrink-0',
				orientation === 'horizontal' ? 'border-border h-[1px] w-full border-b' : 'border-border h-auto w-[1px] border-l',
				className
			)}
			{...props}
		/>
	);
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
