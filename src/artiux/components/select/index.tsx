'use client';

import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { Select as SelectPrimitive } from 'radix-ui';
import * as React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { Button, ButtonProps } from '@/artiux/components/button';
import { ButtonGroup } from '@/artiux/components/buttonGroup';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerProps, DrawerTitle } from '@/artiux/components/drawer';
import { Icon, IconName } from '@/artiux/components/icons';
import { RippleContainer } from '@/artiux/components/rippleContainer/rippleContainer';
import { textVariants } from '@/artiux/components/text';
import { textFieldVariants } from '@/artiux/components/textField';
import { useIsMobile } from '@/artiux/hooks/use-mobile';

export interface SelectProps<TFieldValues extends FieldValues> {
	footerClassname?: string;
	name: Path<TFieldValues>;
	options?: SelectItemProps[];
	control: Control<TFieldValues>;
	placeholder?: string;
	title?: string;
	description?: string;
	ornament?: IconName;
	size?: 'sm' | 'lg';
	typography?: VariantProps<typeof textVariants>['typography'];
	drawerProps?: DrawerProps;
	buttonsProps?: ButtonProps;
	content?: (ctx: {
		value: string;
		tempValue: string | null;
		setTempValue: (v: string) => void;
		confirm: () => void;
		close: () => void;
	}) => React.ReactNode;
}

export interface SelectItemProps {
	label: string;
	value: string | number;
}

// Props comuns às duas variantes (mobile/desktop)
interface SelectVariantProps<TFieldValues extends FieldValues> extends SelectProps<TFieldValues> {
	value: string;
	onChange: (value: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export function Select<TFieldValues extends FieldValues>(props: SelectProps<TFieldValues>) {
	const { name, control } = props;
	const isMobile = useIsMobile('768');
	const [open, setOpen] = React.useState(false);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				const { value, onChange } = field;

				const variantProps: SelectVariantProps<TFieldValues> = {
					...props,
					value,
					onChange,
					open,
					setOpen,
				};

				return isMobile ? <SelectMobile {...variantProps} /> : <SelectDesktop {...variantProps} />;
			}}
		/>
	);
}

// ---------------------------------------------------------------------------
// Mobile — Drawer (comportamento original)
// ---------------------------------------------------------------------------
function SelectMobile<TFieldValues extends FieldValues>({
	value,
	onChange,
	open,
	setOpen,
	options,
	placeholder = 'Selecionar',
	title,
	description,
	ornament,
	size = 'lg',
	typography = 'caption',
	footerClassname,
	drawerProps,
	buttonsProps,
	content,
}: SelectVariantProps<TFieldValues>) {
	const [tempValue, setTempValue] = React.useState<string | null>(null);

	function handleSelect(val: string | number) {
		setOpen(false);
		onChange(String(val));
	}

	return (
		<>
			{/* Trigger */}
			<RippleContainer>
				<button
					type='button'
					onClick={() => setOpen(true)}
					className={cn(
						textFieldVariants({ size }),
						textVariants({ typography }),
						'text-primary relative flex w-full items-center justify-between overflow-hidden'
					)}
				>
					<AnimatePresence mode='wait'>
						<motion.div
							className='flex gap-2'
							key={value || 'placeholder'}
							initial={{ translateY: '150%', opacity: 0 }}
							animate={{ translateY: 0, opacity: 1 }}
							exit={{ translateY: '-150%', opacity: 0 }}
							transition={{ duration: 0.2, ease: 'easeInOut', type: 'spring' }}
						>
							{ornament && (
								<span className='flex items-center'>
									<Icon icon={ornament} className={cn('text-emphasis-mid', size === 'sm' ? 'size-4' : 'size-5')} />
								</span>
							)}

							{(options ? options.find((opt) => opt.value === value)?.label : value) || placeholder}
						</motion.div>
					</AnimatePresence>

					<Icon icon='chevron-down' className={cn('text-primary', size === 'sm' ? 'size-4' : 'size-5')} />
				</button>
			</RippleContainer>

			{/* Drawer */}
			<Drawer {...drawerProps} open={open} onOpenChange={setOpen}>
				<DrawerContent>
					<DrawerTitle className='sr-only'>Escolha uma opção</DrawerTitle>
					{(title || description) && (
						<DrawerHeader>
							{title && <DrawerTitle>{title}</DrawerTitle>}
							{description && <DrawerDescription>{description}</DrawerDescription>}
						</DrawerHeader>
					)}

					{content?.({
						value,
						tempValue,
						setTempValue,
						confirm: () => {
							if (tempValue !== null) {
								onChange(tempValue);
							}
							setOpen(false);
						},
						close: () => setOpen(false),
					})}

					{options && (
						<DrawerFooter className={cn(footerClassname)}>
							<ButtonGroup orientation={'vertical'}>
								{options.map((option) => (
									<Button
										{...buttonsProps}
										key={option.label}
										variant={buttonsProps?.variant || 'secondary'}
										onClick={() => handleSelect(option.value)}
									>
										{option.label}
									</Button>
								))}
							</ButtonGroup>
						</DrawerFooter>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}

// ---------------------------------------------------------------------------
// Desktop — Radix Select + motion
// ---------------------------------------------------------------------------
function SelectDesktop<TFieldValues extends FieldValues>({
	value,
	onChange,
	open,
	setOpen,
	options,
	placeholder = 'Selecionar',
	ornament,
	size = 'lg',
	typography = 'caption',
}: SelectVariantProps<TFieldValues>) {
	const selected = options?.find((opt) => String(opt.value) === value);

	return (
		<SelectPrimitive.Root value={value} onValueChange={onChange} open={open} onOpenChange={setOpen}>
			<RippleContainer>
				<SelectPrimitive.Trigger
					type='button'
					className={cn(
						textFieldVariants({ size }),
						textVariants({ typography }),
						'text-primary relative flex w-full items-center justify-between overflow-hidden'
					)}
				>
					<span className='flex items-center gap-2'>
						{ornament && (
							<span className='flex items-center'>
								<Icon icon={ornament} className={cn('text-emphasis-mid', size === 'sm' ? 'size-4' : 'size-5')} />
							</span>
						)}
						<SelectPrimitive.Value placeholder={placeholder}>
							<AnimatePresence mode='wait'>
								<motion.span
									key={value || 'placeholder'}
									initial={{ translateY: '150%', opacity: 0 }}
									animate={{ translateY: 0, opacity: 1 }}
									exit={{ translateY: '-150%', opacity: 0 }}
									transition={{ duration: 0.2, ease: 'easeInOut', type: 'spring' }}
									className='inline-block'
								>
									{selected?.label || placeholder}
								</motion.span>
							</AnimatePresence>
						</SelectPrimitive.Value>
					</span>

					<SelectPrimitive.Icon asChild>
						<motion.span
							className='flex items-center'
							animate={{ rotate: open ? 180 : 0 }}
							transition={{ duration: 0.2, ease: 'easeInOut' }}
						>
							<Icon icon='chevron-down' className={cn('text-primary', size === 'sm' ? 'size-4' : 'size-5')} />
						</motion.span>
					</SelectPrimitive.Icon>
				</SelectPrimitive.Trigger>
			</RippleContainer>

			<AnimatePresence>
				{open && (
					<SelectPrimitive.Portal forceMount>
						<SelectPrimitive.Content asChild position='popper' sideOffset={0} align='end'>
							<motion.div
								className='bg-popover text-popover-foreground border-border z-50 mt-[calc(var(--radix-select-trigger-height)*-1)] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border p-1 shadow-xl'
								initial={{ opacity: 0, scale: 0.96, y: -4 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.96, y: -4 }}
								transition={{ duration: 0.15, ease: 'easeInOut' }}
							>
								<SelectPrimitive.Viewport>
									{options?.map((option) => (
										<SelectPrimitive.Item
											key={option.label}
											value={String(option.value)}
											className={cn(
												textVariants({ typography }),
												'text-primary data-[highlighted]:bg-accent relative flex cursor-pointer items-center rounded-lg px-3 py-2 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
											)}
										>
											<SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
										</SelectPrimitive.Item>
									))}
								</SelectPrimitive.Viewport>
							</motion.div>
						</SelectPrimitive.Content>
					</SelectPrimitive.Portal>
				)}
			</AnimatePresence>
		</SelectPrimitive.Root>
	);
}
