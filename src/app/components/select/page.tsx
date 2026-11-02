'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlDropdown, ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/artiux/components/select';
import { Controller, useForm } from 'react-hook-form';

const sizes = ['lg', 'sm'] as const;
const ornaments = ['none', 'globe', 'search', 'settings'] as const;

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

export default function SelectComponent() {
	const { control: statusControl } = useForm({
		defaultValues: {
			status: '',
		},
	});

	const [city, setCity] = useState('');
	const [size, setSize] = useState<(typeof sizes)[number]>('lg');
	const [ornament, setOrnament] = useState<(typeof ornaments)[number]>('none');
	const [showDescription, setShowDescription] = useState(true);

	const statusOptions = [
		{ label: 'Ativo', value: 'ativo' },
		{ label: 'Inativo', value: 'inativo' },
		{ label: 'Pendente', value: 'pendente' },
		{ label: 'Cancelado', value: 'cancelado' },
		{ label: 'Expirado', value: 'expirado' },
	];

	const cityOptions = [
		{ label: 'São Paulo', value: 'sp' },
		{ label: 'Rio de Janeiro', value: 'rj' },
		{ label: 'Belo Horizonte', value: 'bh' },
	];

	const triggerProps = [size === 'sm' ? `size='sm'` : null, ornament !== 'none' ? `ornament='${ornament}'` : null]
		.filter(Boolean)
		.join(' ');

	const previewCode = `
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/artiux/components/select';
import { Controller, useForm } from 'react-hook-form';

// Controlado
const [value, setValue] = useState('');

<Select value={value} onValueChange={setValue}>
	<SelectTrigger${triggerProps ? ' ' + triggerProps : ''}>
		<SelectValue placeholder='Selecionar' />
	</SelectTrigger>
	<SelectContent title='Status'${showDescription ? ` description='Selecione o status'` : ''}>
		<SelectGroup>
			<SelectLabel>Situação</SelectLabel>
			<SelectItem value='ativo'>Ativo</SelectItem>
			<SelectItem value='inativo'>Inativo</SelectItem>
		</SelectGroup>
	</SelectContent>
</Select>

// Com react-hook-form
const { control } = useForm({ defaultValues: { status: '' } });

<Controller
	name='status'
	control={control}
	render={({ field }) => (
		<Select value={field.value} onValueChange={field.onChange}>
			<SelectTrigger>
				<SelectValue placeholder='Selecionar' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='ativo'>Ativo</SelectItem>
				<SelectItem value='inativo'>Inativo</SelectItem>
			</SelectContent>
		</Select>
	)}
/>
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Select</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>
						Um seletor de opções responsivo: drawer no mobile e dropdown (Radix Select) no desktop, com API composta e suporte a ícone e
						descrição
					</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<div className='flex w-full max-w-xs flex-col gap-6'>
							<div>
								<span className='text-muted-foreground mb-1 block text-sm'>Padrão (com react-hook-form)</span>
								<Controller
									name='status'
									control={statusControl}
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger size={size} ornament={ornament === 'none' ? undefined : ornament}>
												<SelectValue placeholder='Selecionar' />
											</SelectTrigger>
											<SelectContent
												title='Status'
												description={showDescription ? 'Selecione o status' : undefined}
												content={() => <p className='text-muted-foreground text-sm'>O status define a situação do registro</p>}
											>
												<SelectGroup>
													<SelectLabel>Situação</SelectLabel>
													{statusOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
								/>
							</div>

							<div>
								<span className='text-muted-foreground mb-1 block text-sm'>Controlado, com ícone (ornament)</span>
								<Select value={city} onValueChange={setCity}>
									<SelectTrigger size='sm' ornament='globe'>
										<SelectValue placeholder='Selecionar cidade' />
									</SelectTrigger>
									<SelectContent title='Cidade'>
										{cityOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlDropdown label='Size' value={size} options={sizes} onChange={setSize} />
						<ControlDropdown label='Ornament' value={ornament} options={ornaments} onChange={setOrnament} />
						<ControlSwitch label='Description' checked={showDescription} onChange={setShowDescription} />
					</Customize>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode
							installs='yarn add class-variance-authority motion radix-ui'
							code={componentCode}
							fileName='artiux/components/select/index.tsx'
						/>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{ property: 'Select · value', type: 'string', description: 'Valor selecionado (modo controlado).' },
	{ property: 'Select · defaultValue', type: 'string', description: 'Valor inicial (modo não controlado).' },
	{ property: 'Select · onValueChange', type: '(value: string) => void', description: 'Chamado quando o valor muda.' },
	{ property: 'Select · open', type: 'boolean', description: 'Estado de abertura (modo controlado).' },
	{ property: 'Select · defaultOpen', type: 'boolean', default: 'false', description: 'Estado de abertura inicial.' },
	{ property: 'Select · onOpenChange', type: '(open: boolean) => void', description: 'Chamado quando a abertura muda.' },
	{
		property: 'Select · typography',
		type: "VariantProps<typeof textVariants>['typography']",
		default: "'caption'",
		description: 'Variante tipográfica do gatilho e das opções.',
	},
	{ property: 'SelectTrigger · size', type: "'sm' | 'lg'", default: "'lg'", description: 'Tamanho do gatilho de seleção.' },
	{ property: 'SelectTrigger · ornament', type: 'IconName', description: 'Ícone exibido dentro do gatilho de seleção.' },
	{
		property: 'SelectValue · placeholder',
		type: 'string',
		default: "'Selecionar'",
		description: 'Texto exibido quando nenhum valor está selecionado.',
	},
	{ property: 'SelectContent · title', type: 'string', description: 'Título exibido no cabeçalho do drawer (mobile).' },
	{ property: 'SelectContent · description', type: 'string', description: 'Descrição exibida abaixo do título no drawer (mobile).' },
	{ property: 'SelectContent · footerClassname', type: 'string', description: 'Classes aplicadas ao rodapé do drawer (mobile).' },
	{ property: 'SelectContent · drawerProps', type: 'DrawerProps', description: 'Props repassadas ao componente Drawer (mobile).' },
	{
		property: 'SelectContent · buttonsProps',
		type: 'ButtonProps',
		description: 'Props repassadas aos botões de opção do drawer (mobile).',
	},
	{
		property: 'SelectContent · content',
		type: '(ctx) => React.ReactNode',
		description: 'Conteúdo customizado renderizado dentro do drawer (mobile).',
	},
	{ property: 'SelectGroup', type: 'children', description: 'Agrupa opções.' },
	{ property: 'SelectLabel', type: 'children', description: 'Rótulo de um grupo de opções.' },
	{ property: 'SelectItem · value', type: 'string | number', description: 'Valor da opção; o conteúdo é o rótulo exibido.' },
	{ property: 'SelectItem · disabled', type: 'boolean', description: 'Desabilita a opção.' },
];

const componentCode = `
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

const MOBILE_BREAKPOINT = '768';

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
function collectLabels(children: React.ReactNode) {
	const map = new Map<string, React.ReactNode>();
	const walk = (nodes: React.ReactNode) => {
		React.Children.forEach(nodes, (child) => {
			if (!React.isValidElement(child)) return;
			const props = child.props as { value?: string | number; children?: React.ReactNode };
			if (child.type === SelectItem) {
				map.set(String(props.value), props.children);
			} else if (props.children) {
				walk(props.children);
			}
		});
	};
	walk(children);
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
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const [value, setValue] = useControllable<string>(valueProp, defaultValue, onValueChange);
	const [open, setOpen] = useControllable<boolean>(openProp, defaultOpen, onOpenChange);
	const labels = React.useMemo(() => collectLabels(children), [children]);

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
`;
