'use client';

import useSnap from '@/hook/useSnap';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import ret from '@/assets/brand/retangle.svg';

import BubbleButton from '@/artiux/components/bubbleButton/bubbleButton';
import { Button } from '@/artiux/components/button';
import { ButtonGroup } from '@/artiux/components/buttonGroup';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/artiux/components/card';
import { IconButton } from '@/artiux/components/iconButton';
import { InputNumber } from '@/artiux/components/inputNumber';
import { MultiSelect } from '@/artiux/components/multiSelect';
import { RadioGroup, RadioGroupItem } from '@/artiux/components/radioGroup';
import { Select } from '@/artiux/components/select';
import { Text } from '@/artiux/components/text';
import { useIsMobile } from '@/artiux/hooks/use-mobile';
import CopyCode from '@/components/copyCode/copyCode';
import Grainient from '@/components/grainient';
import { Link } from '@/components/link';
import NoiseSurface from '@/components/meta-noise';
import PageLoader from '@/components/pageLoader/pageLoader';
import { BubbleParticles } from '@/components/ui/background-beam';
import { PointerHighlight } from '@/components/ui/pointer-highlight';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import MouseTrail from '@/components/ui/trail-cursor';
import useScrollSmoother from '@/hook/useScrollSmoother';
import Image from 'next/image';

export default function HomePage() {
	const mainRef = useRef<HTMLElement>(null);
	const cursorRef = useRef<HTMLElement>(null);
	const sectionRef = useRef<HTMLDivElement>(null);
	const elementRef = useRef<HTMLDivElement>(null);

	const isMobile = useIsMobile();

	useSnap(mainRef as any);
	useScrollSmoother(sectionRef as any, elementRef as any);

	const { control: statusControl } = useForm({ defaultValues: { status: '' } });
	const { control: frameworksControl } = useForm({ defaultValues: { frameworks: [] } });
	const { control: quantidadeControl } = useForm({ defaultValues: { quantidade: 1 } });

	const statusOptions = [
		{ label: 'Ativo', value: 'ativo' },
		{ label: 'Inativo', value: 'inativo' },
		{ label: 'Pendente', value: 'pendente' },
	];

	const CardArrowLink = ({ href }: { href: string }) => (
		<Link href={href} asChild>
			<IconButton
				icon='arrow-up-right'
				className='absolute! top-0 right-0 z-10 p-4'
				variant='ghost'
				size='sm'
				aria-label='Ver componente'
			/>
		</Link>
	);

	const frameworkOptions = [
		{ value: 'react', label: 'React' },
		{ value: 'nextjs', label: 'Next.js' },
		{ value: 'tailwind', label: 'Tailwind' },
		{ value: 'typescript', label: 'TypeScript' },
		{ value: 'javascript', label: 'JavaScript' },
	];

	return (
		<>
			<PageLoader />
			<main ref={mainRef} className={`min-h-screen`}>
				<section className='panel relative flex h-screen items-center justify-between overflow-hidden px-10 sm:px-20'>
					<NoiseSurface className='absolute inset-0 -z-10' height={0.3} />
					<BubbleParticles className='absolute inset-0 -z-10 h-full w-full' />

					<main className='flex flex-col items-center gap-4 sm:items-start'>
						<h1 className='text-7xl font-bold'>
							<PointerHighlight rectangleClassName='border-2 border-white' containerClassName=''>
								<span className='z-10'>ArtIux Lab</span>
							</PointerHighlight>
						</h1>
						<code className='rounded bg-black/[.05] px-1 py-0.5 font-[family-name:var(--font-geist-mono)] font-semibold dark:bg-white/[.06]'>
							Biblioteca de componentes animados
						</code>
					</main>
				</section>

				{/* init - Ignore section */}
				<section className='block h-screen bg-gradient-to-b from-black to-black'>
					<div className='relative flex h-full w-full flex-col'>
						<Image src={ret} alt='logo' height={50} className='w-full' />
						<div className='flex-1 bg-white' />
					</div>
				</section>

				<section className='block h-screen bg-gradient-to-b from-black to-black'>
					<div className='relative flex h-full w-full flex-col'>
						<div className='flex-1 bg-white' />
						<Image src={ret} alt='logo' height={50} className='w-full -translate-y-1 -rotate-180' />
					</div>
				</section>
				{/* end - Ignore section */}

				<div ref={sectionRef} className='relative'>
					<div className='absolute right-0 left-0 px-10'>
						<Grainient
							className='absolute !top-20 !right-0 !bottom-0 !left-0 !h-[120vh] rounded-[48] md:!h-[150vh]'
							color1='#3e193e'
							color2='#fefefe'
							color3='#47484d'
							timeSpeed={0.25}
							colorBalance={0}
							warpStrength={1}
							warpFrequency={8}
							warpSpeed={1.3}
							warpAmplitude={5}
							blendAngle={0}
							blendSoftness={0.05}
							rotationAmount={500}
							noiseScale={2}
							grainAmount={0.1}
							grainScale={2}
							grainAnimated={false}
							contrast={1.5}
							gamma={1}
							saturation={1}
							centerX={0}
							centerY={0}
							zoom={0.9}
						/>
					</div>

					<section className='panel @container flex h-screen w-full items-center justify-center pt-20 font-bold'>
						<div className='relative z-10 flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-b-none text-center'>
							<p className='max-w-xl text-xl text-black sm:text-3xl'>
								Desenhado para funcionar com <b>Next.js</b>, <b>Tailwindcss</b>, <b>React</b> e <b>Typescript</b>
							</p>

							<div className='grid w-full max-w-5xl grid-cols-1 gap-4 px-4 text-left sm:grid-cols-2 lg:grid-cols-3'>
								<Card className='relative items-start'>
									<CardArrowLink href='/components/select' />
									<CardHeader>
										<CardTitle>Select</CardTitle>
										<CardDescription>Seletor em drawer</CardDescription>
									</CardHeader>
									<CardContent>
										<Select name='status' control={statusControl} options={statusOptions} placeholder='Selecionar status' />
									</CardContent>
								</Card>

								<Card className='relative items-start'>
									<CardArrowLink href='/components/multiSelect' />
									<CardHeader>
										<CardTitle>Multi Select</CardTitle>
										<CardDescription>Múltipla escolha com busca</CardDescription>
									</CardHeader>
									<CardContent>
										<MultiSelect
											name='frameworks'
											control={frameworksControl as any}
											options={frameworkOptions}
											placeholder='Selecionar'
											maxSelections={2}
										/>
									</CardContent>
								</Card>

								<Card className='relative hidden items-start md:flex'>
									<CardArrowLink href='/components/buttonGroup' />
									<CardHeader>
										<CardTitle>Button Group</CardTitle>
										<CardDescription>Botões agrupados</CardDescription>
									</CardHeader>
									<CardContent>
										<ButtonGroup>
											<Button size='sm' variant='secondary'>
												Um
											</Button>
											<Button size='sm' variant='secondary'>
												Dois
											</Button>
											<Button size='sm' variant='secondary'>
												Três
											</Button>
										</ButtonGroup>
									</CardContent>
								</Card>

								<Card ripple className='relative hidden items-start space-y-2 md:flex'>
									<CardArrowLink href='/components/card' />
									<CardHeader>
										<CardTitle>Card</CardTitle>
										<CardDescription>Subtítulo</CardDescription>
									</CardHeader>

									<CardContent>
										<Text>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies mi vitae est. Pellentesque habitant morbi.
										</Text>
									</CardContent>

									<CardFooter className='w-full'>
										<Button>Continuar</Button>
									</CardFooter>
								</Card>

								<Card className='relative hidden items-start md:flex'>
									<CardArrowLink href='/components/inputNumber' />
									<CardHeader>
										<CardTitle>Input Number</CardTitle>
										<CardDescription>Incremento e decremento</CardDescription>
									</CardHeader>
									<CardContent>
										<InputNumber name='quantidade' control={quantidadeControl} min={0} max={15} step={1} />
									</CardContent>
								</Card>

								<Card className='relative hidden items-start md:flex'>
									<CardArrowLink href='/components/radioGroup' />
									<CardHeader>
										<CardTitle>Radio Group</CardTitle>
										<CardDescription>Grupo de opções de rádio</CardDescription>
									</CardHeader>
									<CardContent>
										<RadioGroup defaultValue='1' className='flex flex-row gap-4'>
											<RadioGroupItem value='1' />
											<RadioGroupItem value='2' />
											<RadioGroupItem value='3' />
										</RadioGroup>
									</CardContent>
								</Card>
							</div>
						</div>
					</section>

					<section className='panel relative flex h-screen flex-col justify-start pt-40 text-center md:justify-between md:pt-0'>
						<nav className='mx-auto flex w-full max-w-lg flex-none items-start justify-center gap-4 px-4 pb-7 md:flex-1 md:items-end'>
							<CopyCode code='' />
						</nav>
						<div className='flex h-56 flex-col items-center gap-4 md:pt-6'>
							<h1 className='font-poppins text-4xl font-light'>
								Apenas copie e cole os componentes
								<p>e use</p>
							</h1>

							<Link href='/components' asChild className='z-10'>
								<BubbleButton className='py-4' loading={false}>
									Ver Componentes
								</BubbleButton>
							</Link>
						</div>
					</section>
				</div>

				{!isMobile && (
					<>
						<SmoothCursor
							ref={cursorRef as any}
							springConfig={{
								damping: 40,
								stiffness: 800,
								mass: 0.5,
								restDelta: 0.01,
							}}
						/>
						<MouseTrail
							lineColor='#fff'
							// lineThickness={6}
							// dashArray='8 20'
							lineThickness={2}
							dashArray='8 10'
							maxTrailLength={20}
							fadeDuration={1000}
							segmentLength={5}
							smoothCursorRef={cursorRef as any} // AGORA O RASTRO SEGUE O CURSOR SUAVIZADO
						/>
					</>
				)}
			</main>
		</>
	);
}
