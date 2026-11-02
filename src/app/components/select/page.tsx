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
// O código-fonte completo do componente está em artiux/components/select/index.tsx
// Partes exportadas: Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem
`;
