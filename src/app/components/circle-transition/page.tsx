'use client';

import { Aside } from '@/artiux/components/aside';
import { pageAnimation } from '@/artiux/components/circleTransition';
import Button from '@/components/button/button';
import CopyCode from '@/components/copyCode/copyCode';
import PreviewCode from '@/components/previewCode/previewCode';
import { useTransitionRouter } from 'next-view-transitions-gabriel-azv';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'code', label: 'Instalação' },
];

export default function CircleTransition() {
	const { push } = useTransitionRouter();

	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Animação de transição circular</h1>
					<p className='text-muted-foreground mt-2 block text-xl'>
						Uma animação de transição que expande um círculo a partir do ponto do clique
					</p>

					<p className='mt-8'>
						Usa o <code>clip-path</code> animado via Web Animations API, aplicado na pseudo-elemento
						<code> ::view-transition-new(root)</code>. O raio máximo é calculado a partir da distância do ponto de clique até o canto mais
						distante da tela, garantindo que o círculo cubra toda a viewport.
					</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={example}>
						<Button
							className='w-max'
							onClick={(e) =>
								push('/components/', {
									onTransitionReady: () =>
										pageAnimation({
											type: 'expansable',
											expansionOrigin: { x: e.clientX, y: e.clientY },
										}),
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
							<CopyCode
								installs='yarn add motion clsx tailwind-merge'
								code={pageAnimationCode}
								fileName='artiux/components/circleTransition/index.tsx'
							/>
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
	`// @/artiux/components/circleTransition/index.tsx
	interface PageAnimationProps {
	type?: 'slide' | 'expansable';
	direction?: 'vertical' | 'horizontal';
	expansionOrigin?: { x: number; y: number }; // centro da expansão
}

export const pageAnimation = ({ type = 'slide', direction = 'vertical', expansionOrigin }: PageAnimationProps) => {
` +
	"	if (type === 'expansable' && expansionOrigin) {" +
	`
		const { x, y } = expansionOrigin;
		const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

		document.documentElement.animate(
			[
` +
	'				{ clipPath: `circle(0px at ${x}px ${y}px)` },' +
	`
` +
	'				{ clipPath: `circle(${maxRadius}px at ${x}px ${y}px)` },' +
	`
			],
			{
				duration: 700,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)',
			}
		);
	}
};
`;

const transitionWrapper = `//@/components/layout/transitionWrapper/transitionWrapper.tsx
'use client';

import { HTMLMotionProps, motion } from 'motion/react';

const TransitionWrapper = (props: HTMLMotionProps<'div'>) => {
	return (
		<div>
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} {...props} />
		</div>
	);
};

export default TransitionWrapper;
`;

const example =
	`// É absolutamente necessário que o ViewTransition fique acima da tag <html/>

import TransitionWrapper from '@/components/layout/transitionWrapper/transitionWrapper';
import { ViewTransitions } from 'next-view-transitions-gabriel-azv';
import { pageAnimation } from '@/artiux/components/circleTransition';

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
						<TransitionWrapper>{children}</TransitionWrapper>
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
	onClick={(e) =>
		push('/components/circle-transition', {
			onTransitionReady: () =>
				pageAnimation({ type: 'expansable', expansionOrigin: { x: e.clientX, y: e.clientY } }),
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
