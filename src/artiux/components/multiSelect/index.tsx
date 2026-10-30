'use client';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';

import { Badge } from '@/artiux/components/badge';
import { Button, ButtonProps } from '@/artiux/components/button';
import { ButtonGroup } from '@/artiux/components/buttonGroup';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/artiux/components/drawer';
import { Icon } from '@/artiux/components/icons';
import { RippleContainer } from '@/artiux/components/rippleContainer/rippleContainer';
import { TextField } from '@/artiux/components/textField';
import { useIsMobile } from '@/artiux/hooks/use-mobile';

export interface MultiSelectOption {
	value: string;
	label: string;
}

export interface MultiSelectProps {
	name: string;
	control: Control<any>;
	options: MultiSelectOption[];
	placeholder?: string;
	title?: string;
	description?: string;
	size?: 'sm' | 'lg';
	maxSelections?: number;
	searchPlaceholder?: string;
	className?: string;
	disabled?: boolean;
	footerClassName?: string;
	buttonsProps?: ButtonProps;
}

export const multiSelectVariants = cva(
	'w-full outline-none bg-input transition-all rounded-xl disabled:cursor-not-allowed disabled:opacity-50 duration-150 ease-out focus-within:bg-accent [&:hover:not(:focus-within)]:bg-accent/30 cursor-pointer',
	{
		variants: {
			size: {
				lg: 'px-4 py-3 text-base min-h-[52px]',
				sm: 'px-3 py-1.5 text-sm min-h-[40px]',
			},
		},
		defaultVariants: {
			size: 'lg',
		},
	}
);

export const chipVariants = cva(
	'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground',
	{
		variants: {
			size: {
				lg: 'text-sm px-2.5 py-1',
				sm: 'text-xs px-2 py-0.5',
			},
		},
		defaultVariants: {
			size: 'lg',
		},
	}
);

interface MultiSelectVariantProps extends MultiSelectProps {
	selectedValues: string[];
	handleToggle: (value: string) => void;
	handleRemove: (value: string, e: React.MouseEvent) => void;
	handleClearAll: (e: React.MouseEvent) => void;
	getLabel: (value: string) => string;
	isMaxReached: boolean | 0 | undefined;
	open: boolean;
	setOpen: (open: boolean) => void;
	triggerRef: React.ForwardedRef<HTMLDivElement>;
}

function MultiSelectComponent(
	{
		name,
		control,
		options,
		placeholder = 'Selecionar',
		title,
		description,
		size = 'lg',
		maxSelections,
		searchPlaceholder = 'Buscar...',
		className,
		disabled = false,
		footerClassName,
		buttonsProps,
	}: MultiSelectProps,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	const isMobile = useIsMobile('768');
	const [open, setOpen] = useState(false);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				const selectedValues: string[] = field.value || [];

				const handleToggle = (value: string) => {
					const isSelected = selectedValues.includes(value);

					if (isSelected) {
						field.onChange(selectedValues.filter((v) => v !== value));
					} else {
						if (maxSelections && selectedValues.length >= maxSelections) {
							return;
						}
						field.onChange([...selectedValues, value]);
					}
				};

				const handleRemove = (value: string, e: React.MouseEvent) => {
					e.stopPropagation();
					field.onChange(selectedValues.filter((v) => v !== value));
				};

				const handleClearAll = (e: React.MouseEvent) => {
					e.stopPropagation();
					field.onChange([]);
				};

				const getLabel = (value: string) => {
					return options.find((opt) => opt.value === value)?.label || value;
				};

				const isMaxReached = maxSelections && selectedValues.length >= maxSelections;

				const variantProps: MultiSelectVariantProps = {
					name,
					control,
					options,
					placeholder,
					title,
					description,
					size,
					maxSelections,
					searchPlaceholder,
					className,
					disabled,
					footerClassName,
					buttonsProps,
					selectedValues,
					handleToggle,
					handleRemove,
					handleClearAll,
					getLabel,
					isMaxReached,
					open,
					setOpen,
					triggerRef: ref,
				};

				return isMobile ? <MultiSelectMobile {...variantProps} /> : <MultiSelectDesktop {...variantProps} />;
			}}
		/>
	);
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------
// Trigger
//
const Trigger = forwardRef<
	HTMLDivElement,
	{
		selectedValues: string[];
		getLabel: (value: string) => string;
		handleRemove: (value: string, e: React.MouseEvent) => void;
		handleClearAll: (e: React.MouseEvent) => void;
		placeholder: string;
		size: 'sm' | 'lg';
		disabled: boolean;
		className?: string;
		onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	} & React.HTMLAttributes<HTMLDivElement>
>(({ selectedValues, getLabel, handleRemove, handleClearAll, placeholder, size, disabled, className, onClick, ...props }, ref) => {
	return (
		<div
			{...props}
			ref={ref}
			onClick={(e) => !disabled && onClick?.(e)}
			className={cn(
				multiSelectVariants({ size }),
				'relative flex w-full items-center justify-between gap-2',
				disabled && 'cursor-not-allowed opacity-50',
				className
			)}
		>
			<div className='flex flex-1 flex-wrap items-center gap-1.5'>
				<AnimatePresence mode='popLayout'>
					{selectedValues.length > 0 ? (
						selectedValues.map((value) => (
							<motion.div
								key={value}
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0, opacity: 0 }}
								transition={{
									type: 'spring',
									stiffness: 500,
									damping: 30,
									mass: 0.8,
								}}
							>
								<Badge className='rounded-lg' ornament='x' ornamentPosition='right' size='sm' onClick={(e) => handleRemove(value, e)}>
									{getLabel(value)}
								</Badge>
							</motion.div>
						))
					) : (
						<span className='text-muted-foreground'>{placeholder}</span>
					)}
				</AnimatePresence>
			</div>

			{selectedValues.length > 0 && (
				<button type='button' onClick={handleClearAll} className='text-emphasis-mid hover:text-primary flex shrink-0 items-center'>
					<Icon icon='x' className={cn(size === 'sm' ? 'size-4' : 'size-5')} />
				</button>
			)}

			<Icon icon='chevron-down' className='text-primary shrink-0' />
		</div>
	);
});
Trigger.displayName = 'MultiSelectTrigger';

// ---------------------------------------------------------------------------
// Mobile — Drawer
// ---------------------------------------------------------------------------
function MultiSelectMobile({
	options,
	placeholder = 'Selecionar',
	title,
	description,
	size = 'lg',
	maxSelections,
	searchPlaceholder = 'Buscar...',
	className,
	disabled = false,
	footerClassName,
	selectedValues,
	handleToggle,
	handleRemove,
	handleClearAll,
	getLabel,
	isMaxReached,
	open,
	setOpen,
	triggerRef,
}: MultiSelectVariantProps) {
	const {
		control: searchControl,
		watch,
		reset: resetSearch,
	} = useForm({
		defaultValues: { search: '' },
	});

	const searchValue = watch('search');

	const filteredOptions = !searchValue
		? options
		: options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));

	useEffect(() => {
		if (!open) {
			resetSearch();
		}
	}, [open]);

	return (
		<>
			{/* Trigger */}
			<RippleContainer>
				<Trigger
					ref={triggerRef}
					selectedValues={selectedValues}
					getLabel={getLabel}
					handleRemove={handleRemove}
					handleClearAll={handleClearAll}
					placeholder={placeholder}
					size={size}
					disabled={disabled}
					className={className}
					onClick={() => setOpen(true)}
				/>
			</RippleContainer>

			{/* Drawer */}
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerContent>
					{(title || description) && (
						<DrawerHeader>
							{title && <DrawerTitle>{title}</DrawerTitle>}
							{description && <DrawerDescription>{description}</DrawerDescription>}
						</DrawerHeader>
					)}

					<section className='mb-4 block'>
						{/* Search Input */}
						<div className='my-2'>
							<TextField name='search' control={searchControl} ornament='search' ornamentPosition='left' placeholder={searchPlaceholder} />
						</div>

						{/* Selection info */}
						{maxSelections && (
							<span className='text-emphasis-low text-sm'>
								{selectedValues.length} de {maxSelections} selecionados
							</span>
						)}
					</section>

					<ButtonGroup orientation={'vertical'}>
						{filteredOptions.length === 0 ? (
							<div className='text-muted-foreground py-4 text-center text-sm'>Nenhuma opção encontrada</div>
						) : (
							filteredOptions.map((option) => {
								const isSelected = selectedValues.includes(option.value);
								const isDisabled = !isSelected && isMaxReached;

								return (
									<Button
										key={option.value}
										variant='secondary'
										className={cn('w-full', isDisabled && 'opacity-50')}
										onClick={() => !isDisabled && handleToggle(option.value)}
										ornament={isSelected ? 'check' : undefined}
										ornamentPosition='right'
									>
										{option.label}
									</Button>
								);
							})
						)}
					</ButtonGroup>

					<DrawerFooter className={cn('flex max-h-[50vh] flex-row flex-wrap overflow-y-auto', footerClassName)}>
						<Button onClick={() => setOpen(false)}>Confirmar</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</>
	);
}

// ---------------------------------------------------------------------------
// Desktop — Popover (Radix)
// ---------------------------------------------------------------------------
function MultiSelectDesktop({
	options,
	placeholder = 'Selecionar',
	size = 'lg',
	maxSelections,
	searchPlaceholder = 'Buscar...',
	className,
	disabled = false,
	selectedValues,
	handleToggle,
	handleRemove,
	handleClearAll,
	getLabel,
	isMaxReached,
	open,
	setOpen,
	triggerRef,
}: MultiSelectVariantProps) {
	const searchInputRef = useRef<HTMLInputElement>(null);

	const {
		control: searchControl,
		watch,
		reset: resetSearch,
	} = useForm({
		defaultValues: { search: '' },
	});

	const searchValue = watch('search');

	const filteredOptions = !searchValue
		? options
		: options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));

	useEffect(() => {
		if (!open) {
			resetSearch();
		}
	}, [open]);

	return (
		<PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
			<PopoverPrimitive.Trigger asChild>
				<span className='block w-full'>
					<RippleContainer>
						<Trigger
							ref={triggerRef}
							selectedValues={selectedValues}
							getLabel={getLabel}
							handleRemove={handleRemove}
							handleClearAll={handleClearAll}
							placeholder={placeholder}
							size={size}
							disabled={disabled}
							className={className}
						/>
					</RippleContainer>
				</span>
			</PopoverPrimitive.Trigger>

			<AnimatePresence>
				{open && (
					<PopoverPrimitive.Portal forceMount>
						<PopoverPrimitive.Content
							asChild
							side='bottom'
							align='end'
							sideOffset={0}
							onOpenAutoFocus={(e) => {
								e.preventDefault();
								searchInputRef.current?.focus();
							}}
						>
							<motion.div
								className='bg-popover text-popover-foreground border-border z-50 mt-[calc(var(--radix-popover-trigger-height)*-1)] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border p-2 shadow-xl'
								initial={{ opacity: 0, scale: 0.96, y: -4 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.96, y: -4 }}
								transition={{ duration: 0.15, ease: 'easeInOut' }}
							>
								<div className='mb-2'>
									<TextField
										ref={searchInputRef}
										name='search'
										control={searchControl}
										ornament='search'
										ornamentPosition='left'
										placeholder={searchPlaceholder}
									/>
								</div>

								{maxSelections && (
									<span className='text-emphasis-low mb-1 block text-sm'>
										{selectedValues.length} de {maxSelections} selecionados
									</span>
								)}

								<div className='scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-zinc-100/0 max-h-64 overflow-y-auto'>
									{filteredOptions.length === 0 ? (
										<div className='text-muted-foreground py-4 text-center text-sm'>Nenhuma opção encontrada</div>
									) : (
										filteredOptions.map((option) => {
											const isSelected = selectedValues.includes(option.value);
											const isDisabled = !isSelected && isMaxReached;

											return (
												<button
													key={option.value}
													type='button'
													disabled={!!isDisabled}
													onClick={() => !isDisabled && handleToggle(option.value)}
													className={cn(
														'text-primary hover:bg-accent relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ease-out outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
														isSelected && 'bg-primary text-primary-foreground hover:bg-primary/95'
													)}
												>
													{option.label}
													<AnimatePresence initial={false}>
														{isSelected && (
															<motion.span
																initial={{ scale: 0, opacity: 0, rotate: -90 }}
																animate={{ scale: 1, opacity: 1, rotate: 0 }}
																exit={{ scale: 0, opacity: 0, rotate: -90 }}
																transition={{ type: 'spring', stiffness: 500, damping: 30 }}
																className='flex items-center'
															>
																<Icon icon='check' className='text-primary-foreground size-4' />
															</motion.span>
														)}
													</AnimatePresence>
												</button>
											);
										})
									)}
								</div>
							</motion.div>
						</PopoverPrimitive.Content>
					</PopoverPrimitive.Portal>
				)}
			</AnimatePresence>
		</PopoverPrimitive.Root>
	);
}

export const MultiSelect = forwardRef(MultiSelectComponent);
