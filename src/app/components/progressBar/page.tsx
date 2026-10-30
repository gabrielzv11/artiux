'use client';

import { useState } from 'react';

import CopyCode from '@/components/copyCode/copyCode';
import { ControlDropdown, ControlSlider, ControlSwitch, Customize } from '@/components/customize/customize';
import { PropsTable } from '@/components/customize/propsTable';
import PreviewCode from '@/components/previewCode/previewCode';

import { Aside } from '@/artiux/components/aside';
import { ProgressBar } from '@/artiux/components/progressBar';

const labelPositions = ['right', 'top', 'bottom', 'left', 'none'] as const;

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'props', label: 'Props' },
	{ id: 'code', label: 'Instalação' },
];

export default function ProgressBarComponent() {
	const [progress, setProgress] = useState(50);
	const [labelPosition, setLabelPosition] = useState<(typeof labelPositions)[number]>('right');
	const [animated, setAnimated] = useState(true);

	const props = [
		`progress={${progress}}`,
		labelPosition !== 'right' ? `labelPosition='${labelPosition}'` : null,
		animated ? 'animated' : null,
	]
		.filter(Boolean)
		.join(' ');

	const previewCode = `
import { ProgressBar } from '@/artiux/components/progressBar';

<ProgressBar ${props} />
`;

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Progress Bar</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>Uma barra de progresso animada</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<div className='w-full max-w-md'>
							<ProgressBar progress={progress} labelPosition={labelPosition} animated={animated} />
						</div>
					</PreviewCode>
				</section>

				<section id='customize' className='my-8 scroll-mt-24'>
					<Customize>
						<ControlSlider label='Progress' value={progress} min={0} max={100} step={1} unit='%' onChange={setProgress} />
						<ControlDropdown label='Label position' value={labelPosition} options={labelPositions} onChange={setLabelPosition} />
						<ControlSwitch label='Animated' checked={animated} onChange={setAnimated} />
					</Customize>
				</section>

				<section id='props' className='my-8 scroll-mt-24'>
					<PropsTable rows={propRows} />

					<div className='mt-8'>
						<h3 className='text-2xl font-bold'>Exemplos:</h3>
						<div className='mt-4 flex w-full max-w-md flex-col gap-6'>
							<ProgressBar progress={50} labelPosition='right' animated />
							<ProgressBar progress={80} labelPosition='top' animated />
							<ProgressBar progress={30} labelPosition='bottom' animated />
							<ProgressBar progress={65} labelPosition='left' animated />
							<ProgressBar progress={100} labelPosition='none' animated={false} />
						</div>
					</div>
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode
							installs='yarn add class-variance-authority'
							code={componentCode}
							fileName='artiux/components/progressBar/index.tsx'
						/>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const propRows = [
	{ property: 'progress', type: 'number', description: 'Valor do progresso, de 0 a 100.' },
	{
		property: 'animated',
		type: 'boolean',
		default: 'true',
		description: 'Anima a transição de preenchimento e o efeito de shimmer.',
	},
	{
		property: 'labelPosition',
		type: "'top' | 'bottom' | 'left' | 'right' | 'none'",
		default: "'right'",
		description: 'Posição do rótulo de porcentagem em relação à barra.',
	},
	{ property: 'backgroundClassName', type: 'string', description: 'Classes aplicadas ao trilho de fundo da barra.' },
	{ property: 'fillClassName', type: 'string', description: 'Classes aplicadas ao preenchimento da barra.' },
];

const componentCode = `
'use client';

import { textVariants } from '@/artiux/components/text';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
	progress: number;
	animated?: boolean;
	labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none';
	backgroundClassName?: string;
	fillClassName?: string;
}

export function ProgressBar({
	progress,
	animated = true,
	labelPosition = 'right',
	backgroundClassName,
	fillClassName,
	...props
}: ProgressBarProps) {
	const [currentProgress, setCurrentProgress] = useState(animated ? 0 : progress);

	const normalizedProgress = Math.min(Math.max(progress, 0), 100);

	useEffect(() => {
		if (animated) {
			const t = setTimeout(() => setCurrentProgress(normalizedProgress), 100);
			return () => clearTimeout(t);
		}
		setCurrentProgress(normalizedProgress);
	}, [normalizedProgress, animated]);

	const fillStyle: React.CSSProperties = {
		width: \`\${currentProgress}%\`,
		transition: animated ? 'width 800ms cubic-bezier(0.4,0,0.2,1)' : undefined,
	};

	const Label = <span className={cn('text-primary whitespace-nowrap', textVariants({ typography: 'description-2' }))}>{progress}%</span>;

	return (
		<div className={cn('w-full', props.className)}>
			{/* TOP */}
			{labelPosition === 'top' && <div className='mb-2'>{Label}</div>}

			<div className='flex items-center gap-2'>
				{/* LEFT */}
				{labelPosition === 'left' && Label}

				<div className={cn('bg-primary/15 animate-fade-in relative h-1 flex-1 overflow-hidden rounded-xl', backgroundClassName)}>
					<div className={cn('bg-primary relative h-full rounded-xl', fillClassName)} style={fillStyle}>
						<div className='animate-shimmer absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200px_100%]' />
					</div>
				</div>

				{/* RIGHT */}
				{labelPosition === 'right' && Label}
			</div>

			{/* BOTTOM */}
			{labelPosition === 'bottom' && <div className='mt-2'>{Label}</div>}
		</div>
	);
}
`;
