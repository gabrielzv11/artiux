'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlDropdown, ControlSlider, ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { MultiSelect } from '@/artiux/components/multiSelect';
import { useForm } from 'react-hook-form';

const sizes = ['lg', 'sm'] as const;

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

export default function MultiSelectComponent() {
	const { control } = useForm({
		defaultValues: {
			frameworks: [],
		},
	});

	const { control: tagsControl } = useForm({
		defaultValues: {
			tags: [],
		},
	});

	const [size, setSize] = useState<(typeof sizes)[number]>('lg');
	const [maxSelections, setMaxSelections] = useState(3);
	const [disabled, setDisabled] = useState(false);

	const frameworkOptions = [
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' },
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'nextjs', label: 'Next.js' },
		{ value: 'nuxtjs', label: 'Nuxt.js' },
		{ value: 'remix', label: 'Remix' },
		{ value: 'astro', label: 'Astro' },
		{ value: 'gatsby', label: 'Gatsby' },
	];

	const tagOptions = [
		{ value: 'urgente', label: 'Urgente' },
		{ value: 'bug', label: 'Bug' },
		{ value: 'melhoria', label: 'Melhoria' },
	];

	const props = [size === 'sm' ? `size='sm'` : null, `maxSelections={${maxSelections}}`, disabled ? 'disabled' : null]
		.filter(Boolean)
		.join(' ');

	const previewCode = `
import { MultiSelect } from '@/artiux/components/multiSelect';
import { useForm } from 'react-hook-form';

const { control } = useForm({ defaultValues: { frameworks: [] } });

const options = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];

<MultiSelect
	name='frameworks'
	control={control}
	options={options}
	title='Frameworks'
	placeholder='Selecione...'
	${props}
/>
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Multi Select</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>
						Um seletor de múltiplas opções em drawer, com busca e limite de seleção
					</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<div className='flex w-full max-w-xs flex-col gap-6'>
							<div>
								<span className='text-muted-foreground mb-1 block text-sm'>Com limite de seleção</span>
								<MultiSelect
									name='frameworks'
									control={control as any}
									options={frameworkOptions}
									title='Frameworks'
									description={`Escolha até ${maxSelections} frameworks`}
									placeholder='Selecione...'
									maxSelections={maxSelections}
									searchPlaceholder='Buscar...'
									size={size}
									disabled={disabled}
								/>
							</div>

							<div>
								<span className='text-muted-foreground mb-1 block text-sm'>Tamanho pequeno</span>
								<MultiSelect
									name='tags'
									control={tagsControl as any}
									options={tagOptions}
									title='Tags'
									placeholder='Selecione as tags'
									size='sm'
								/>
							</div>
						</div>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlDropdown label='Size' value={size} options={sizes} onChange={setSize} />
						<ControlSlider label='Max selections' value={maxSelections} min={1} max={9} step={1} onChange={setMaxSelections} />
						<ControlSwitch label='Disabled' checked={disabled} onChange={setDisabled} />
					</Customize>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode
							installs='yarn add class-variance-authority motion react-hook-form'
							code={componentCode}
							fileName='artiux/components/multiSelect/index.tsx'
						/>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{ property: 'name', type: 'string', description: 'Nome do campo no formulário (react-hook-form).' },
	{ property: 'control', type: 'Control<any>', description: 'Objeto de controle do react-hook-form.' },
	{ property: 'options', type: '{ value: string; label: string }[]', description: 'Lista de opções disponíveis para seleção.' },
	{ property: 'placeholder', type: 'string', default: "'Selecionar'", description: 'Texto exibido quando nenhuma opção está selecionada.' },
	{ property: 'title', type: 'string', description: 'Título exibido no cabeçalho do drawer.' },
	{ property: 'description', type: 'string', description: 'Descrição exibida no cabeçalho do drawer.' },
	{ property: 'size', type: "'sm' | 'lg'", default: "'lg'", description: 'Tamanho do campo de seleção.' },
	{ property: 'maxSelections', type: 'number', description: 'Limite máximo de opções selecionáveis.' },
	{ property: 'searchPlaceholder', type: 'string', default: "'Buscar...'", description: 'Placeholder do campo de busca no drawer.' },
	{ property: 'disabled', type: 'boolean', default: 'false', description: 'Desabilita a interação com o componente.' },
	{ property: 'footerClassName', type: 'string', description: 'Classes aplicadas ao rodapé do drawer.' },
	{ property: 'buttonsProps', type: 'ButtonProps', description: 'Props repassadas aos botões de opção do drawer.' },
];

const componentCode = `
'use client';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, useEffect, useState } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';

import { Badge } from '@/artiux/components/badge';
import { Button, ButtonProps } from '@/artiux/components/button';
import { ButtonGroup } from '@/artiux/components/buttonGroup';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/artiux/components/drawer';
import { Icon } from '@/artiux/components/icons';
import { RippleContainer } from '@/artiux/components/rippleContainer';
import { TextField } from '@/artiux/components/textField';

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
	'w-full outline-none bg-input transition-all rounded-xl disabled:cursor-not-allowed disabled:opacity-50 duration-150 ease-out focus-within:bg-accent [&:hover:not(:focus-within)]:bg-accent cursor-pointer',
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
	const [open, setOpen] = useState(false);

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

				const getLabel = (value: string) => {
					return options.find((opt) => opt.value === value)?.label || value;
				};

				const isMaxReached = maxSelections && selectedValues.length >= maxSelections;

				return (
					<>
						{/* Trigger */}
						<RippleContainer>
							<div
								ref={ref}
								onClick={() => !disabled && setOpen(true)}
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
													<Badge
														className='rounded-lg'
														ornament='x'
														ornamentPosition='right'
														size='sm'
														onClick={(e) => handleRemove(value, e)}
													>
														{getLabel(value)}
													</Badge>
												</motion.div>
											))
										) : (
											<span className='text-muted-foreground'>{placeholder}</span>
										)}
									</AnimatePresence>
								</div>

								<Icon icon='chevron-down' className='text-primary shrink-0' />
							</div>
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
										<TextField
											name='search'
											control={searchControl}
											ornament='search'
											ornamentPosition='left'
											placeholder={searchPlaceholder}
										/>
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
			}}
		/>
	);
}

export const MultiSelect = forwardRef(MultiSelectComponent);
`;
