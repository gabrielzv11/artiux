'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlDropdown, ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { Button } from '@/artiux/components/button';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

const variants = ['primary', 'secondary', 'ghost'] as const;
const colors = ['primary', 'warning', 'destructive', 'success', 'info'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const ornaments = ['none', 'settings', 'heart'] as const;
const ornamentPositions = ['left', 'right'] as const;

export default function ButtonComponent() {
	const [variant, setVariant] = useState<(typeof variants)[number]>('primary');
	const [color, setColor] = useState<(typeof colors)[number]>('primary');
	const [size, setSize] = useState<(typeof sizes)[number]>('lg');
	const [ornament, setOrnament] = useState<(typeof ornaments)[number]>('settings');
	const [ornamentPosition, setOrnamentPosition] = useState<(typeof ornamentPositions)[number]>('left');
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const props = [
		`variant='${variant}'`,
		`color='${color}'`,
		size !== 'lg' ? `size='${size}'` : null,
		ornament !== 'none' ? `ornament='${ornament}'` : null,
		ornament !== 'none' && ornamentPosition === 'right' ? `ornamentPosition='right'` : null,
		loading ? 'loading' : null,
		disabled ? 'disabled' : null,
	]
		.filter(Boolean)
		.join(' ');

	const previewCode = `
import { Button } from '@/artiux/components/button';

<Button ${props}>
	Button
</Button>
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Button</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>Um botão com efeito ripple, estado de loading e ornamentos</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<Button
							variant={variant}
							color={color}
							size={size === 'lg' ? undefined : size}
							ornament={ornament === 'none' ? undefined : ornament}
							ornamentPosition={ornamentPosition}
							loading={loading}
							disabled={disabled}
						>
							Button
						</Button>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlDropdown label='Variant' value={variant} options={variants} onChange={setVariant} />
						<ControlDropdown label='Color' value={color} options={colors} onChange={setColor} />
						<ControlDropdown label='Size' value={size} options={sizes} onChange={setSize} />
						<ControlDropdown label='Ornament' value={ornament} options={ornaments} onChange={setOrnament} />
						<ControlDropdown
							label='Ornament position'
							value={ornamentPosition}
							options={ornamentPositions}
							onChange={setOrnamentPosition}
						/>
						<ControlSwitch label='Loading' checked={loading} onChange={setLoading} />
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
							installs='yarn add class-variance-authority motion lucide-react'
							code={componentCode}
							fileName='artiux/components/button/index.tsx'
						/>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{ property: 'variant', type: "'primary' | 'secondary' | 'ghost'", default: "'primary'", description: 'Estilo visual do botão.' },
	{
		property: 'color',
		type: "'primary' | 'warning' | 'destructive' | 'success' | 'info'",
		default: "'primary'",
		description: 'Cor semântica aplicada ao botão.',
	},
	{ property: 'size', type: "'sm' | 'md' | 'lg'", default: "'lg'", description: 'Tamanho do botão.' },
	{ property: 'ornament', type: 'IconName', description: 'Ícone exibido junto ao texto.' },
	{ property: 'ornamentPosition', type: "'left' | 'right'", default: "'left'", description: 'Posição do ícone em relação ao texto.' },
	{ property: 'loading', type: 'boolean', default: 'false', description: 'Exibe indicador de carregamento e desabilita o botão.' },
	{ property: 'disabled', type: 'boolean', default: 'false', description: 'Desabilita o botão.' },
	{
		property: 'typography',
		type: "VariantProps<typeof textVariants>['typography']",
		default: "'action'",
		description: 'Variante tipográfica do texto.',
	},
	{
		property: 'forceTextCentered',
		type: 'boolean',
		default: 'false',
		description: 'Força texto e ornamento centralizados mesmo fora da variante ghost.',
	},
];

const componentCode = `
'use client';

import { textVariants } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { CircularProgress } from '@/components/ui/circularProgress';
import { Icon, IconName } from '@/components/ui/icons';
import { RippleContainer } from '@/components/ui/rippleContainer';
import { Color, getColors } from '@/utils/getColors';
import { motion } from 'motion/react';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'ghost';
	color?: Color;
	loading?: boolean;
	size?: 'sm' | 'md' | 'lg';
	ornament?: IconName;
	ornamentPosition?: 'left' | 'right';
	typography?: VariantProps<typeof textVariants>['typography'];
	forceTextCentered?: boolean;
}

export function Button({
	children,
	variant = 'primary',
	color = 'primary',
	size,
	ornament,
	ornamentPosition = 'left',
	typography = 'action',
	forceTextCentered,
	loading,
	...props
}: ButtonProps) {
	const buttonVariants = cva(
		\`relative flex w-full text-nowrap overflow-hidden scrollbar-none font-semibold items-center box-border justify-center gap-2 rounded-xl duration-300 tracking-wider outline-none transition-all hover:brightness-95 active:brightness-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:brightness-100 data-[loading=true]:opacity-80 data-[loading=true]:pointer-events-none\`,
		{
			variants: {
				variant: {
					primary: \`bg-\${getColors(color).background} text-\${getColors(color).foreground} shadow-xl shadow-\${getColors(color).background}/15\`,
					secondary: \`bg-\${getColors(color).background}/15 text-\${getColors(color).background}\`,
					ghost: \`text-\${getColors(color).background} rounded-none\`,
				},
				size: {
					lg: 'px-4 py-3 text-base',
					md: 'px-4 py-2 text-sm',
					sm: 'px-3 py-1.5 text-sm w-max',
				},
			},
			defaultVariants: {
				variant: 'primary',
				size: 'lg',
			},
		}
	);
	return (
		<>
			<RippleContainer>
				<button
					data-variant={variant}
					data-loading={loading}
					disabled={loading || props.disabled}
					type={props.type || 'button'}
					{...props}
					className={cn('group', textVariants({ typography }), buttonVariants({ variant, size }), props.className)}
				>
					<motion.div
						className='flex items-center justify-center gap-2'
						initial={{ translateY: 0 }}
						animate={{ translateY: loading ? '-150%' : 0, opacity: loading ? 0 : 1 }}
						transition={{ duration: 0.3, ease: 'easeInOut', type: 'spring' }}
					>
						{variant === 'ghost' || forceTextCentered ? (
							<>
								{ornament && (
									<Icon
										icon={ornament}
										className={cn('opacity-0', size === 'sm' ? 'size-5' : 'size-6', ornamentPosition === 'left' && 'opacity-100')}
									/>
								)}

								{children}

								{ornament && (
									<Icon
										icon={ornament}
										className={cn('opacity-0', size === 'sm' ? 'size-5' : 'size-6', ornamentPosition === 'right' && 'opacity-100')}
									/>
								)}
							</>
						) : (
							<>
								{ornament && ornamentPosition === 'left' && <Icon icon={ornament} className={size === 'sm' ? 'size-4' : 'size-5'} />}

								{children}

								{ornament && ornamentPosition === 'right' && <Icon icon={ornament} className={size === 'sm' ? 'size-4' : 'size-5'} />}
							</>
						)}
					</motion.div>

					<motion.div
						className='absolute flex justify-center'
						initial={{ translateY: '150%', opacity: 0 }}
						animate={{ translateY: loading ? 0 : '150%', opacity: loading ? 1 : 0 }}
						transition={{ duration: 0.2, ease: 'easeInOut', type: 'spring', stiffness: 150, damping: 12 }}
					>
						<CircularProgress
							className={cn('group-data-[variant="primary"]:fill-primary-foreground', size === 'sm' ? 'size-5' : 'size-6')}
						/>
					</motion.div>
				</button>
			</RippleContainer>
		</>
	);
}
`;
