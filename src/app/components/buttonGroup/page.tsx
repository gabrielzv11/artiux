'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlDropdown, ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { Button } from '@/artiux/components/button';
import { ButtonGroup } from '@/artiux/components/buttonGroup';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

const orientations = ['horizontal', 'vertical'] as const;

export default function ButtonGroupComponent() {
	const [orientation, setOrientation] = useState<(typeof orientations)[number]>('horizontal');
	const [showSeparator, setShowSeparator] = useState(true);

	const props = [`orientation='${orientation}'`, showSeparator ? 'showSeparator' : 'showSeparator={false}'].filter(Boolean).join(' ');

	const previewCode = `
import { Button } from '@/artiux/components/button';
import { ButtonGroup } from '@/artiux/components/buttonGroup';

<ButtonGroup ${props}>
	<Button variant='secondary'>Botão 1</Button>
	<Button variant='secondary'>Botão 2</Button>
	<Button variant='secondary'>Botão 3</Button>
</ButtonGroup>
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Button Group</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>Agrupa botões lado a lado, com separadores opcionais</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<ButtonGroup
							orientation={orientation}
							showSeparator={showSeparator}
							className={orientation === 'vertical' ? 'w-max' : undefined}
						>
							<Button variant='primary'>Topo</Button>
							<Button variant='primary'>Meio</Button>
							<Button variant='primary'>Baixo</Button>
						</ButtonGroup>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlDropdown label='Orientation' value={orientation} options={orientations} onChange={setOrientation} />
						<ControlSwitch label='Show separator' checked={showSeparator} onChange={setShowSeparator} />
					</Customize>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode
							installs='yarn add class-variance-authority radix-ui'
							code={componentCode}
							fileName='artiux/components/buttonGroup/index.tsx'
						/>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{
		property: 'orientation',
		type: "'horizontal' | 'vertical'",
		default: "'horizontal'",
		description: 'Direção em que os botões são agrupados.',
	},
	{
		property: 'showSeparator',
		type: 'boolean',
		default: 'true',
		description: 'Exibe um separador entre cada item do grupo.',
	},
];

const componentCode = `
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { Separator } from '@/components/ui/separator';
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
	// Transforma os filhos em um array para manipular
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
				"bg-muted flex items-center gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
				className
			)}
			{...props}
		/>
	);
}

function ButtonGroupSeparator({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof Separator>) {
	return (
		<Separator
			data-slot='button-group-separator'
			orientation={orientation}
			className={cn('bg-border shrink-0', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-auto w-[1px]', className)}
			{...props}
		/>
	);
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
`;
