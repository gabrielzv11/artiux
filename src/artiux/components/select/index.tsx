'use client';

import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { Select as SelectPrimitive } from 'radix-ui';
import * as React from 'react';

import { Button, ButtonProps } from '@/artiux/components/button';
import { ButtonGroup } from '@/artiux/components/buttonGroup';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerProps, DrawerTitle } from '@/artiux/components/drawer';
import { Icon, IconName } from '@/artiux/components/icons';
import { RippleContainer } from '@/artiux/components/rippleContainer/rippleContainer';
import { textVariants } from '@/artiux/components/text';
import { textFieldVariants } from '@/artiux/components/textField';
import { useIsMobile } from '@/artiux/hooks/use-mobile';

type Typography = VariantProps<typeof textVariants>['typography'];
type SelectSize = 'sm' | 'lg';

// ---------------------------------------------------------------------------
// Estado controlável
// ---------------------------------------------------------------------------
function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
	const [internal, setInternal] = React.useState<T>(defaultValue);
	const isControlled = value !== undefined;
	const current = isControlled ? value : internal;
	const set = React.useCallback(
		(next: T) => {
			if (!isControlled) setInternal(next);
			onChange?.(next);
		},
		[isControlled, onChange]
	);
	return [current, set] as const;
}

// ---------------------------------------------------------------------------
// Contextos
// ---------------------------------------------------------------------------
interface SelectContextValue {
	value: string;
	setValue: (value: string) => void;
	open: boolean;
	setOpen: (open: boolean) => void;
	isMobile: boolean;
	typography: Typography;
	labels: Map<string, React.ReactNode>;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
	const ctx = React.useContext(SelectContext);
	if (!ctx) throw new Error('Os componentes do Select devem ser usados dentro de <Select>');
	return ctx;
}

const TriggerContext = React.createContext<{ size: SelectSize; ornament?: IconName }>({ size: 'lg' });
const DrawerItemsContext = React.createContext<{ buttonsProps?: ButtonProps }>({});

// Coleta os labels dos SelectItem declarados nos children (para exibir o valor selecionado com o conteúdo fechado)
function collectLabels(children: React.ReactNode, map = new Map<string, React.ReactNode>()) {
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;
		const props = child.props as { value?: string | number; children?: React.ReactNode };
		if (child.type === SelectItem) {
			map.set(String(props.value), props.children);
		} else if (props.children) {
			collectLabels(props.children, map);
		}
	});
	return map;
}

// ---------------------------------------------------------------------------
// Select (raiz)
// ---------------------------------------------------------------------------
export interface SelectProps {
	children?: React.ReactNode;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	typography?: Typography;
}

export function Select({
	children,
	value: valueProp,
	defaultValue = '',
	onValueChange,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	typography = 'caption',
}: SelectProps) {
	const isMobile = useIsMobile('768');
	const [value, setValue] = useControllable<string>(valueProp, defaultValue, onValueChange);
	const [open, setOpen] = useControllable<boolean>(openProp, defaultOpen, onOpenChange);
	const labels = collectLabels(children);

	return (
		<SelectContext.Provider value={{ value, setValue, open, setOpen, isMobile, typography, labels }}>
			{isMobile ? (
				children
			) : (
				<SelectPrimitive.Root value={value} onValueChange={setValue} open={open} onOpenChange={setOpen}>
					{children}
				</SelectPrimitive.Root>
			)}
		</SelectContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// SelectTrigger
// ---------------------------------------------------------------------------
export interface SelectTriggerProps {
	children?: React.ReactNode;
	size?: SelectSize;
	ornament?: IconName;
	className?: string;
}

export function SelectTrigger({ children, size = 'lg', ornament, className }: SelectTriggerProps) {
	const { isMobile, typography, open, setOpen } = useSelectContext();
	const classes = cn(
		textFieldVariants({ size }),
		textVariants({ typography }),
		'text-primary relative flex w-full items-center justify-between overflow-hidden',
		className
	);
	const chevron = <Icon icon='chevron-down' className={cn('text-primary', size === 'sm' ? 'size-4' : 'size-5')} />;

	return (
		<TriggerContext.Provider value={{ size, ornament }}>
			<RippleContainer>
				{isMobile ? (
					<button type='button' onClick={() => setOpen(true)} className={classes}>
						{children}
						{chevron}
					</button>
				) : (
					<SelectPrimitive.Trigger type='button' className={classes}>
						{children}
						<SelectPrimitive.Icon asChild>
							<motion.span
								className='flex items-center'
								animate={{ rotate: open ? 180 : 0 }}
								transition={{ duration: 0.2, ease: 'easeInOut' }}
							>
								{chevron}
							</motion.span>
						</SelectPrimitive.Icon>
					</SelectPrimitive.Trigger>
				)}
			</RippleContainer>
		</TriggerContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// SelectValue
// ---------------------------------------------------------------------------
export interface SelectValueProps {
	placeholder?: string;
}

export function SelectValue({ placeholder = 'Selecionar' }: SelectValueProps) {
	const { value, isMobile, labels } = useSelectContext();
	const { size, ornament } = React.useContext(TriggerContext);
	const label = labels.get(value);

	const ornamentNode = ornament && (
		<span className='flex items-center'>
			<Icon icon={ornament} className={cn('text-emphasis-mid', size === 'sm' ? 'size-4' : 'size-5')} />
		</span>
	);

	if (isMobile) {
		return (
			<AnimatePresence mode='wait'>
				<motion.div
					className='flex gap-2'
					key={value || 'placeholder'}
					initial={{ translateY: '150%', opacity: 0 }}
					animate={{ translateY: 0, opacity: 1 }}
					exit={{ translateY: '-150%', opacity: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut', type: 'spring' }}
				>
					{ornamentNode}
					{label || value || placeholder}
				</motion.div>
			</AnimatePresence>
		);
	}

	return (
		<span className='flex items-center gap-2'>
			{ornamentNode}
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
						{label || placeholder}
					</motion.span>
				</AnimatePresence>
			</SelectPrimitive.Value>
		</span>
	);
}

// ---------------------------------------------------------------------------
// SelectContent — Drawer no mobile, Radix Select + motion no desktop
// ---------------------------------------------------------------------------
export interface SelectContentProps {
	children?: React.ReactNode;
	/** Mobile: título do drawer */
	title?: string;
	/** Mobile: descrição do drawer */
	description?: string;
	/** Mobile: classes do rodapé com os botões de opção */
	footerClassname?: string;
	/** Mobile: props repassadas ao Drawer */
	drawerProps?: DrawerProps;
	/** Mobile: props repassadas aos botões de opção */
	buttonsProps?: ButtonProps;
	/** Mobile: conteúdo customizado dentro do drawer */
	content?: (ctx: {
		value: string;
		tempValue: string | null;
		setTempValue: (v: string) => void;
		confirm: () => void;
		close: () => void;
	}) => React.ReactNode;
}

export function SelectContent({ children, title, description, footerClassname, drawerProps, buttonsProps, content }: SelectContentProps) {
	const { isMobile, open, setOpen, value, setValue } = useSelectContext();
	const [tempValue, setTempValue] = React.useState<string | null>(null);

	if (isMobile) {
		return (
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
								setValue(tempValue);
							}
							setOpen(false);
						},
						close: () => setOpen(false),
					})}

					{children && (
						<DrawerFooter className={cn(footerClassname)}>
							<ButtonGroup orientation={'vertical'}>
								<DrawerItemsContext.Provider value={{ buttonsProps }}>{children}</DrawerItemsContext.Provider>
							</ButtonGroup>
						</DrawerFooter>
					)}
				</DrawerContent>
			</Drawer>
		);
	}

	return (
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
							<SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
						</motion.div>
					</SelectPrimitive.Content>
				</SelectPrimitive.Portal>
			)}
		</AnimatePresence>
	);
}

// ---------------------------------------------------------------------------
// SelectGroup / SelectLabel
// ---------------------------------------------------------------------------
export interface SelectGroupProps {
	children?: React.ReactNode;
	className?: string;
}

export function SelectGroup({ children, className }: SelectGroupProps) {
	const { isMobile } = useSelectContext();
	if (isMobile) {
		return (
			<div role='group' className={cn('flex flex-col gap-2', className)}>
				{children}
			</div>
		);
	}
	return <SelectPrimitive.Group className={className}>{children}</SelectPrimitive.Group>;
}

export interface SelectLabelProps {
	children?: React.ReactNode;
	className?: string;
}

export function SelectLabel({ children, className }: SelectLabelProps) {
	const { isMobile, typography } = useSelectContext();
	const classes = cn(textVariants({ typography }), 'text-emphasis-mid px-3 py-2', className);
	if (isMobile) return <div className={classes}>{children}</div>;
	return <SelectPrimitive.Label className={classes}>{children}</SelectPrimitive.Label>;
}

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------
export interface SelectItemProps {
	value: string | number;
	children?: React.ReactNode;
	disabled?: boolean;
	className?: string;
}

export function SelectItem({ value, children, disabled, className }: SelectItemProps) {
	const { isMobile, typography, setValue, setOpen } = useSelectContext();
	const { buttonsProps } = React.useContext(DrawerItemsContext);

	if (isMobile) {
		return (
			<Button
				{...buttonsProps}
				disabled={disabled}
				variant={buttonsProps?.variant || 'secondary'}
				onClick={() => {
					setOpen(false);
					setValue(String(value));
				}}
			>
				{children}
			</Button>
		);
	}

	return (
		<SelectPrimitive.Item
			value={String(value)}
			disabled={disabled}
			className={cn(
				textVariants({ typography }),
				'text-primary data-[highlighted]:bg-accent relative flex cursor-pointer items-center rounded-lg px-3 py-2 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				className
			)}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}
