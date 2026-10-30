'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { Button } from '@/artiux/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/artiux/components/card';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

export default function CardComponent() {
	const [ripple, setRipple] = useState(false);
	const [srOnlyTitle, setSrOnlyTitle] = useState(false);

	const props = [ripple ? 'ripple' : null].filter(Boolean).join(' ');

	const previewCode = `
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/artiux/components/card';

<Card ${props} className='max-w-sm'>
	<CardHeader>
		<CardTitle${srOnlyTitle ? ' srOnly' : ''}>Título</CardTitle>
		<CardDescription>Subtítulo</CardDescription>
	</CardHeader>

	<CardContent>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit.
	</CardContent>

	<CardFooter>
		<Button>Continuar</Button>
	</CardFooter>
</Card>
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Card</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>Um container para agrupar conteúdo relacionado</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<Card ripple={ripple} className='max-w-sm'>
							<CardHeader>
								<CardTitle srOnly={srOnlyTitle}>Título</CardTitle>
								<CardDescription>Subtítulo</CardDescription>
							</CardHeader>

							<CardContent>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies mi vitae est. Pellentesque habitant morbi
								tristique senectus et netus et malesuada fames ac turpis egestas.
							</CardContent>

							<CardFooter>
								<Button>Continuar</Button>
							</CardFooter>
						</Card>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlSwitch label='Ripple' checked={ripple} onChange={setRipple} />
						<ControlSwitch label='Título sr-only' checked={srOnlyTitle} onChange={setSrOnlyTitle} />
					</Customize>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode installs='yarn add class-variance-authority' code={componentCode} fileName='artiux/components/card/index.tsx' />
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{ property: 'ripple', type: 'boolean', default: 'false', description: 'Torna o card inteiro clicável e adiciona o efeito de ripple.' },
	{ property: 'className', type: 'string', description: 'Classes utilitárias adicionais aplicadas ao card.' },
	{
		property: 'CardTitle.srOnly',
		type: 'boolean',
		default: 'false',
		description: 'Exibe o título apenas para leitores de tela.',
	},
	{
		property: 'CardTitle.typography',
		type: "VariantProps<typeof textVariants>['typography']",
		default: "'h4'",
		description: 'Variante tipográfica do título.',
	},
	{ property: 'CardHeader', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Container do cabeçalho do card.' },
	{ property: 'CardDescription', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Texto de descrição/subtítulo do card.' },
	{ property: 'CardContent', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Container do conteúdo principal do card.' },
	{ property: 'CardFooter', type: 'React.HTMLAttributes<HTMLDivElement>', description: 'Container do rodapé do card.' },
];

const componentCode = `
import { RippleContainer } from '@/components/ui/rippleContainer';
import { textVariants } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

export interface CardProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	ripple?: boolean;
}
interface CardTitleProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	/**
	 * @prop {boolean} srOnly - Define se o texto deve ser exibido apenas para leitores de tela
	 */
	srOnly?: boolean;
	typography?: VariantProps<typeof textVariants>['typography'];
}

interface CardContentProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Card({ title, children, ripple, ...props }: CardProps) {
	return (
		<>
			{ripple ? (
				<RippleContainer>
					<div
						{...props}
						className={cn('bg-card text-card-foreground flex w-full min-w-32 flex-col rounded-3xl p-4 shadow-sm', props.className)}
					>
						{children}
					</div>
				</RippleContainer>
			) : (
				<div
					{...props}
					className={cn('bg-card text-card-foreground flex w-full min-w-32 flex-col gap-4 rounded-3xl p-4 shadow-sm', props.className)}
				>
					{children}
				</div>
			)}
		</>
	);
}

export function CardHeader({ children, ...props }: CardContentProps) {
	return (
		<div {...props} className={cn('flex flex-col', props.className)}>
			{children}
		</div>
	);
}

export function CardTitle({ srOnly, children, ...props }: CardTitleProps) {
	return (
		<div
			{...props}
			className={cn(
				'flex items-center gap-2',
				srOnly && 'sr-only',
				textVariants({ typography: props.typography || 'h4' }),
				props.className
			)}
		>
			{children}
		</div>
	);
}

export function CardDescription({ children, ...props }: CardContentProps) {
	return (
		<div {...props} className={cn('text-emphasis-low', textVariants({ typography: 'description-2' }))}>
			{children}
		</div>
	);
}

export function CardContent({ children, ...props }: CardContentProps) {
	return (
		<div {...props} className={cn('w-full overflow-hidden', props.className)}>
			{children}
		</div>
	);
}

export function CardFooter({ children, ...props }: CardContentProps) {
	return (
		<div {...props} className={cn(\`flex flex-col gap-2\`, props.className)}>
			{children}
		</div>
	);
}
`;
