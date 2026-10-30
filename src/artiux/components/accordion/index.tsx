'use client';

import { ChevronDownIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type AccordionContextValue = {
	openValues: string[];
	toggle: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

type AccordionItemContextValue = {
	value: string;
	open: boolean;
	toggle: () => void;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function toArray(value?: string | string[]): string[] {
	if (value == null) return [];
	return Array.isArray(value) ? value : [value];
}

export interface AccordionProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
	type?: 'single' | 'multiple';
	defaultValue?: string | string[];
	value?: string | string[];
	onValueChange?: (value: string | string[]) => void;
}

function Accordion({ type = 'multiple', defaultValue, value, onValueChange, className, children, ...props }: AccordionProps) {
	const [internal, setInternal] = React.useState<string[]>(toArray(defaultValue));
	const openValues = value !== undefined ? toArray(value) : internal;

	const toggle = React.useCallback(
		(val: string) => {
			const next =
				type === 'single'
					? openValues.includes(val)
						? []
						: [val]
					: openValues.includes(val)
						? openValues.filter((v) => v !== val)
						: [...openValues, val];

			if (value === undefined) setInternal(next);
			onValueChange?.(type === 'single' ? (next[0] ?? '') : next);
		},
		[openValues, type, value, onValueChange]
	);

	const contextValue = React.useMemo(() => ({ openValues, toggle }), [openValues, toggle]);

	return (
		<AccordionContext.Provider value={contextValue}>
			<div data-slot='accordion' className={cn('flex flex-col', className)} {...props}>
				{children}
			</div>
		</AccordionContext.Provider>
	);
}

function AccordionItem({ value, className, children, ...props }: React.ComponentProps<'div'> & { value: string }) {
	const ctx = React.useContext(AccordionContext);
	if (!ctx) throw new Error('Accordion.Item must be used within Accordion');

	const open = ctx.openValues.includes(value);
	const toggle = React.useCallback(() => ctx.toggle(value), [ctx, value]);
	const itemContextValue = React.useMemo(() => ({ value, open, toggle }), [value, open, toggle]);

	return (
		<AccordionItemContext.Provider value={itemContextValue}>
			<div data-slot='accordion-item' data-state={open ? 'open' : 'closed'} className={className} {...props}>
				{children}
			</div>
		</AccordionItemContext.Provider>
	);
}

function useAccordionItem() {
	const ctx = React.useContext(AccordionItemContext);
	if (!ctx) throw new Error('useAccordionItem must be used within Accordion.Item');
	return ctx;
}

function AccordionTrigger({ className, children, onClick, ...props }: React.ComponentProps<'button'>) {
	const { open, toggle } = useAccordionItem();

	return (
		<button
			type='button'
			data-slot='accordion-trigger'
			data-state={open ? 'open' : 'closed'}
			aria-expanded={open}
			onClick={(event) => {
				onClick?.(event);
				toggle();
			}}
			className={cn('flex w-full items-center justify-between gap-2 text-left', className)}
			{...props}
		>
			{children}
		</button>
	);
}

function AccordionChevron({ className }: { className?: string }) {
	const { open } = useAccordionItem();
	return <ChevronDownIcon className={cn('size-4 shrink-0 transition-transform duration-200', open && 'rotate-180', className)} />;
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<'div'>) {
	const { open } = useAccordionItem();

	return (
		<AnimatePresence initial={false}>
			{open && (
				<motion.div
					data-slot='accordion-content'
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: 'auto', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
					className='overflow-hidden'
				>
					<div className={className} {...props}>
						{children}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Chevron = AccordionChevron;
Accordion.Content = AccordionContent;

export { Accordion, useAccordionItem };
