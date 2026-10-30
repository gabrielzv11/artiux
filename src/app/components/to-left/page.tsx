'use client';

import { Aside } from '@/artiux/components/aside';
import Button from '@/components/button/button';
import CopyCode from '@/components/copyCode/copyCode';
import { pageAnimation } from '@/components/layout/transitionWrapper/pageAnimation';
import PreviewCode from '@/components/previewCode/previewCode';
import { useTransitionRouter } from 'next-view-transitions-gabriel-azv';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'code', label: 'Instalação' },
];

export default function ToLeft() {
	const { push } = useTransitionRouter();

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Animação de página à esquerda</h1>
					<p className='text-muted-foreground mt-2 block text-xl'>Uma animação de transição imersiva de uma página para outra</p>

					<p className='mt-8'>
						Animações de transições no Next ainda são um tópico delicado nas versões mais recentes. Apesar do next-view-transitions ser uma
						mão na roda, para as versões do Next 15, foi necessário fazer um fork alternativo para consertar um bug de build que
						provavelmente vão consertar nas próximas versões.
					</p>

					<p>
						Também se fez necessário adicionar algumas linhas de <code>CSS</code> no <code>globals.css</code>
					</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={example}>
						<Button
							className='w-max'
							onClick={() =>
								push('/components/to-left', {
									onTransitionReady: () => pageAnimation({ direction: 'horizontal' }),
								})
							}
						>
							Link
						</Button>
					</PreviewCode>
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='flex flex-wrap'>
						<div className='mt-4 place-content-start'>
							<CopyCode installs='yarn add motion clsx tailwind-merge' code={pageAnimationCode} />
						</div>
						<div className='mt-4 place-content-start'>
							<CopyCode installs='yarn add next-view-transitions-gabriel-azv' code={transitionWrapper} />
						</div>
						<div className='mt-4 place-content-start'>
							<CopyCode installs='Inclua no globals.css' code={globals} />
						</div>
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const pageAnimationCode =
	`// @/components/layout/pageAnimation.tsx
	interface pageAnimationProps {
	direction: 'vertical' | 'horizontal';
}

const directionMap = {
	vertical: 'translateY',
	horizontal: 'translateX',
};

export const pageAnimation = ({ direction = 'vertical' }: pageAnimationProps) => {
	document.documentElement.animate(
		[
			{
				opacity: 1,
				scale: 1,
` +
	'				transform: `${directionMap[direction]}(0)`,' +
	`			},
			{
				opacity: 0.5,
				scale: 0.9,
` +
	'				transform: `${directionMap[direction]}(-100px)`,' +
	`
			},
		],
		{
			duration: 1000,
			easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
			fill: 'forwards',
			pseudoElement: '::view-transition-old(root)',
		}
	);

	document.documentElement.animate(
		[
			{
` +
	'				transform: `${directionMap[direction]}(100%)`,' +
	`
			},
			{
` +
	'				transform: `${directionMap[direction]}(0)`,' +
	`
			},
		],
		{
			duration: 1000,
			easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
			fill: 'forwards',
			pseudoElement: '::view-transition-new(root)',
		}
	);
};
`;

const transitionWrapper = `//@/components/layout/transitionWrapper.tsx
'use client';

import { HTMLMotionProps, motion } from 'motion/react';

const TransitionWrapper = (props: HTMLMotionProps<'div'>) => {
	return (
		<div>
			<motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} {...props} />
		</div>
	);
};

export default TransitionWrapper;
`;

const example =
	`// É absolutamente necessário que o ViewTransition fique acima da tag <html/>
	
import TransitionWrapper from '@/components/layout/transitionWrapper/transitionWrapper';
import { ViewTransitions } from 'next-view-transitions-gabriel-azv';
import { pageAnimation } from '@/components/layout/transitionWrapper/pageAnimation';

	export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ViewTransitions>
			<html lang='pt-BR' className='scroll-smooth'>
` +
	'				<body className={`${poppins.variable} ${geistMono.variable} antialiased`}>' +
	`
					<Header />
					<main className='min-h-screen'>
						<PageWrapper>{children}</PageWrapper>
					</main>

					<Footer />
				</body>
			</html>

			<Analytics />
		</ViewTransitions>
	);
}

const ExampleButton = ()=>{
return(
<button
	className='w-max'
	onClick={() =>
		push('/components/to-left', {
			onTransitionReady: () => pageAnimation({ direction: 'horizontal' }),
		})
	}
>
	Link
</button>
)
}
`;

const globals = `
/* ViewTransitions */
::view-transition-group(root) {
	z-index: auto !important;
}

::view-transition-image-pair(root) {
	isolation: isolate;
	will-change: transform, opacity, scale;
	z-index: 1;
}

::view-transition-new(root) {
	z-index: 2;
	animation: none !important;
}

::view-transition-old(root) {
	z-index: 1;
	animation: none !important;
}
`;
