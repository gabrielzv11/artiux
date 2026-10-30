'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlDropdown, ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { TextField } from '@/artiux/components/textField';
import { useForm } from 'react-hook-form';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

const sizes = ['lg', 'sm'] as const;
const ornaments = ['none', 'settings', 'search'] as const;
const ornamentPositions = ['left', 'right'] as const;

export default function TextFieldComponent() {
	const { control } = useForm({
		defaultValues: {
			padrao: '',
			cpf: '',
			valor: 0,
			comErro: '',
		},
	});

	const [size, setSize] = useState<(typeof sizes)[number]>('lg');
	const [ornament, setOrnament] = useState<(typeof ornaments)[number]>('settings');
	const [ornamentPosition, setOrnamentPosition] = useState<(typeof ornamentPositions)[number]>('left');
	const [error, setError] = useState(false);

	const props = [
		`name='padrao'`,
		size === 'sm' ? `size='sm'` : null,
		`placeholder='Placeholder'`,
		ornament !== 'none' ? `ornament='${ornament}'` : null,
		ornament !== 'none' && ornamentPosition === 'right' ? `ornamentPosition='right'` : null,
		error ? 'error' : null,
		error ? `helperText='Campo obrigatório'` : null,
	]
		.filter(Boolean)
		.join(' ');

	const previewCode = `
import { TextField } from '@/artiux/components/textField';
import { useForm } from 'react-hook-form';

const { control } = useForm({ defaultValues: { padrao: '' } });

<TextField ${props} control={control} />
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Text Field</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>
						Um input de texto com máscara, ornamentos, tipos customizados (moeda) e mensagens de ajuda/erro
					</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<div className='flex w-full max-w-sm flex-col gap-4'>
							<TextField
								name='padrao'
								control={control}
								placeholder='Placeholder'
								size={size}
								ornament={ornament === 'none' ? undefined : ornament}
								ornamentPosition={ornamentPosition}
								error={error}
								helperText={error ? 'Campo obrigatório' : undefined}
							/>
							<TextField name='cpf' control={control} placeholder='CPF' ornament='search' ornamentPosition='left' mask='999.999.999-99' />
							<TextField name='valor' control={control} placeholder='Valor' customType='currency' />
							<TextField name='comErro' control={control} placeholder='Com erro' error helperText='Campo obrigatório' />
						</div>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlDropdown label='Size' value={size} options={sizes} onChange={setSize} />
						<ControlDropdown label='Ornament' value={ornament} options={ornaments} onChange={setOrnament} />
						<ControlDropdown
							label='Ornament position'
							value={ornamentPosition}
							options={ornamentPositions}
							onChange={setOrnamentPosition}
						/>
						<ControlSwitch label='Error' checked={error} onChange={setError} />
					</Customize>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode
							installs='yarn add react-hook-form class-variance-authority @mona-health/react-input-mask'
							code={componentCode}
							fileName='artiux/components/textField/index.tsx'
						/>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{ property: 'name', type: 'Path<TFieldValues>', description: 'Nome do campo controlado pelo react-hook-form.' },
	{
		property: 'control',
		type: 'Control<TFieldValues>',
		description: 'Objeto de controle do formulário (react-hook-form). Opcional se usado dentro de um FormProvider.',
	},
	{ property: 'placeholder', type: 'string', description: 'Texto exibido quando o campo está vazio.' },
	{ property: 'size', type: "'sm' | 'lg'", default: "'lg'", description: 'Tamanho do campo.' },
	{ property: 'mask', type: 'string', description: 'Máscara de formatação aplicada ao valor digitado.' },
	{ property: 'ornament', type: 'IconName', description: 'Ícone exibido dentro do campo.' },
	{ property: 'ornamentPosition', type: "'left' | 'right'", description: 'Posição do ícone dentro do campo.' },
	{ property: 'ornamentClassname', type: 'string', description: 'Classes adicionais aplicadas ao ícone.' },
	{ property: 'ornamentProps', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Props repassadas ao container do ícone.' },
	{
		property: 'typography',
		type: "VariantProps<typeof textVariants>['typography']",
		default: "'body'",
		description: 'Variante tipográfica do texto do campo.',
	},
	{ property: 'error', type: 'boolean', default: 'false', description: 'Exibe o campo em estado de erro.' },
	{ property: 'helperText', type: 'string', description: 'Texto de ajuda/erro exibido abaixo do campo.' },
	{
		property: 'customType',
		type: "'currency'",
		description: 'Aplica um comportamento de formatação customizado ao valor (ex: moeda).',
	},
];

const componentCode = `
'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Control, Controller, FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { Icon, IconName } from '@/artiux/components/icons';
import { RippleContainer } from '@/artiux/components/rippleContainer';
import { Text, textVariants } from '@/artiux/components/text';
import { cn } from '@/lib/utils';
import InputMask from '@mona-health/react-input-mask';

/* =========================================================
 * Custom Types (currency etc)
 * ======================================================= */

export type CustomTypeHandler = {
	initialDisplay: () => string;
	syncDisplay: (value: unknown, state: CustomTypeState) => CustomTypeState | null;
	onChange: (value: string) => {
		display: string;
		formValue: number | string;
		prevNumeric: number;
	};
	inputProps: (state: CustomTypeState) => Record<string, unknown>;
};

export type CustomTypeState = {
	display: string;
	prevNumeric: number;
};

export const customTypeHandlers = {
	currency: {
		initialDisplay: (): string => '',

		syncDisplay(value: unknown, state: CustomTypeState): CustomTypeState | null {
			if (typeof value !== 'number') return null;

			const display = value.toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			});

			if (display === state.display) return null;

			return {
				display,
				prevNumeric: value,
			};
		},

		onChange(value: string) {
			const numeric = Number(value.replace(/\\D/g, '')) / 100;

			const display = numeric.toLocaleString('pt-BR', {
				style: 'currency',
				currency: 'BRL',
			});

			return {
				display,
				formValue: numeric,
				prevNumeric: numeric,
			};
		},

		inputProps(state: CustomTypeState): Record<string, unknown> {
			return {
				value: state.display,
			};
		},
	},
} satisfies Record<string, CustomTypeHandler>;

export type CustomType = keyof typeof customTypeHandlers;

/* =========================================================
 * Props
 * ======================================================= */

export interface TextFieldProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'size' | 'name'
> {
	name: Path<TFieldValues>;
	control?: Control<TFieldValues>;
	placeholder?: string;
	size?: 'sm' | 'lg';
	mask?: string;
	id?: string;
	className?: string;

	ornament?: IconName;
	ornamentClassname?: string;
	ornamentPosition?: 'left' | 'right';
	ornamentProps?: React.HTMLAttributes<HTMLDivElement>;

	typography?: VariantProps<typeof textVariants>['typography'];

	error?: boolean;
	helperText?: string;

	customType?: CustomType;
}

/* =========================================================
 * Styles
 * ======================================================= */

export const textFieldVariants = cva(
	'w-full outline-none bg-input transition-all rounded-xl disabled:cursor-not-allowed disabled:opacity-50 duration-150 ease-out',
	{
		variants: {
			size: {
				lg: 'px-4 py-3 text-base',
				sm: 'px-3 py-1.5 text-sm',
			},
			error: {
				true: 'bg-destructive/10 focus:bg-destructive/10',
				false: '',
			},
		},
		defaultVariants: {
			size: 'lg',
			error: false,
		},
	}
);

/* =========================================================
 * Component
 * ======================================================= */

function TextFieldComponent<TFieldValues extends FieldValues = FieldValues>(
	{
		name,
		control: controlProp,
		placeholder,
		size,
		type = 'text',
		mask,
		id,
		className,
		ornament,
		ornamentClassname,
		ornamentPosition,
		ornamentProps,
		typography = 'body',
		error = false,
		helperText,
		customType,
		...props
	}: TextFieldProps<TFieldValues>,
	ref: React.Ref<HTMLInputElement>
) {
	const context = useFormContext<TFieldValues>();
	const control = controlProp ?? context?.control;

	const handler = customType ? customTypeHandlers[customType] : null;

	const [customState, setCustomState] = useState<CustomTypeState>(() =>
		handler ? { display: handler.initialDisplay(), prevNumeric: 0 } : { display: '', prevNumeric: 0 }
	);

	const inputClassName = cn(
		textFieldVariants({ size, error }),
		textVariants({ typography }),
		ornamentPosition === 'left' ? 'pl-12' : ornamentPosition === 'right' ? 'pr-12' : '',
		className
	);

	const renderOrnament = () => {
		if (!ornament) return null;

		return (
			<div
				{...ornamentProps}
				className={cn('absolute top-1/2 size-5 -translate-y-1/2', ornamentPosition === 'left' ? 'left-4' : 'right-4')}
			>
				<Icon icon={ornament} className={cn('text-emphasis-mid', size === 'sm' ? 'size-4' : 'size-5', ornamentClassname)} />
			</div>
		);
	};

	const renderInput = (fieldProps: Record<string, unknown> = {}) => (
		<div className='w-full'>
			<RippleContainer>
				<div className='relative rounded-xl focus-within:outline-none'>
					{mask ? (
						<InputMask
							{...fieldProps}
							ref={ref as React.Ref<HTMLInputElement>}
							id={id}
							mask={mask}
							className={inputClassName}
							placeholder={placeholder}
						/>
					) : (
						<input {...props} {...fieldProps} ref={ref} type={type} id={id} className={inputClassName} placeholder={placeholder} />
					)}

					{renderOrnament()}
				</div>
			</RippleContainer>

			{helperText && (
				<Text typography='description-2' className={cn('mt-1.5', error ? 'text-destructive' : 'text-muted-foreground')}>
					{helperText}
				</Text>
			)}
		</div>
	);

	if (!control) {
		return renderInput({ name });
	}

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => {
				if (handler) {
					const synced = handler.syncDisplay(field.value, customState);
					if (synced) setCustomState(synced);
				}

				const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
					if (!handler) return field.onChange(e.target.value);

					const { display, formValue, prevNumeric } = handler.onChange(e.target.value);

					setCustomState({ display, prevNumeric });

					field.onChange(formValue as PathValue<TFieldValues, Path<TFieldValues>>);
				};

				const customProps = handler
					? {
							...handler.inputProps(customState),
							onChange: handleChange,
						}
					: {};

				return renderInput({
					...field,
					...customProps,
					onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
						field.onBlur();
						props.onBlur?.(e);
					},
				});
			}}
		/>
	);
}

export const TextField = forwardRef(TextFieldComponent) as <TFieldValues extends FieldValues = FieldValues>(
	props: TextFieldProps<TFieldValues> & {
		ref?: React.Ref<HTMLInputElement>;
	}
) => React.ReactElement;
`;
