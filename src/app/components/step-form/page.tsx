'use client';

import { Aside } from '@/artiux/components/aside';
import CopyCode from '@/components/copyCode/copyCode';

import AnimatedForm from '@/components/animatedForm/animatedForm';
import PreviewCode from '@/components/previewCode/previewCode';

const asideItems = [
	{ id: 'preview', label: 'Prévia' },
	{ id: 'code', label: 'Instalação' },
];

export default function StepFormComponent() {
	return (
		<div className='flex items-start gap-10'>
			<div className='min-w-0 flex-1'>
				<div>
					<h1 className='mt-20 text-5xl font-bold'>Step Form</h1>
					<p className='text-muted-foreground mt-4 block text-xl'>Um provider de formulário com animação passo-a-passo</p>
				</div>

				<section id='preview' className='my-8 scroll-mt-24'>
					<PreviewCode code={previewCode}>
						<div className='w-max'>
							<AnimatedForm />
						</div>
					</PreviewCode>
				</section>

				<section id='code' className='my-8 scroll-mt-24'>
					<h3 className='text-2xl font-bold'>Instalação:</h3>
					<div className='mt-4 place-content-start'>
						<CopyCode installs='yarn add motion' code={componentCode} fileName='components/stepFormProvider/stepFormProvider.tsx' />
					</div>
				</section>
			</div>

			<Aside items={asideItems} />
		</div>
	);
}

const previewCode = `
// Instalações
// yarn add react-hook-form lucide-react react-hot-toast

'use client';

import StepFormProvider from '@/components/stepFormProvider/stepFormProvider';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@/components/button/button';
import Label from '@/components/label/label';
import TextField from '@/components/textField/textField';
import { ArrowLeft, ArrowRight, Check, FormInput } from 'lucide-react';

interface AnimatedFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export type FormSignUpData = {
	username: string;
	email: string;
	password: string;
};

export default function AnimatedForm({ ...props }: AnimatedFormProps) {
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);

	const methods = useForm<FormSignUpData>();

	const steps = [
		{ title: 'Email', component: EmailStep },
		{ title: 'Nome', component: NameStep },
		{ title: 'Senha', component: PasswordStep },
	];

	const isLastStep = step === steps.length - 1;
	const isFirstStep = step === 0;

	const nextStep = () => {
		if (step < steps.length - 1) {
			setStep(step + 1);
		}
	};

	const prevStep = () => {
		if (step > 0) {
			setStep(step - 1);
		}
	};

	const handleNextClick = () => {
		if (isLastStep) {
			methods.handleSubmit(onSubmit)();
		} else {
			nextStep();
		}
	};

	const formComponents = [
		<EmailStep key='email' />,
		<NameStep key='name' />,
		<PasswordStep key='password' />,
	];

	const onSubmit = async () => {
		if (step < steps.length - 1) {
			nextStep();
			return;
		}

		setLoading(true);

		setTimeout(() => {
			toast.success('Simulação de conta!');
			setLoading(false);
		}, 1000);
	};
	return (
		<>
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit(onSubmit)}
					className={cn('text-foreground min-w-[300px] rounded-lg bg-zinc-800 p-4', props.className)}
				>
					<div className='relative h-[200px]'>
						<StepFormProvider forms={formComponents} actualForm={step} />
					</div>

					<div className='flex items-center justify-between'>
						{!isFirstStep && (
							<button
								type='button'
								onClick={prevStep}
								className='hover:bg-muted-foreground/25 flex items-center gap-1 px-4 py-2 text-sm transition-all'
							>
								<ArrowLeft size={16} />
								Voltar
							</button>
						)}

						<div className='ml-auto'>
							<Button type='button' onClick={handleNextClick} loading={loading}>
								{isLastStep ? 'Criar conta' : 'Próximo'}
								{!loading && !isLastStep && <ArrowRight size={16} />}
								{!loading && isLastStep && <Check size={16} />}
							</Button>
						</div>
					</div>
				</form>
			</FormProvider>
		</>
	);
}

function EmailStep() {
	const { register } = useFormContext<FormSignUpData>();

	return (
		<div className='flex h-full w-full flex-col space-y-4'>
			<h2 className='flex items-center gap-1 font-light'>
				<FormInput />
				<span>Formulário passo-a-passo</span>
			</h2>
			<LabelInputContainer>
				<Label htmlFor='email'>Endereço de e-mail</Label>
				<TextField id='email' type='email' placeholder='Digite seu email' register={register('email')} />
			</LabelInputContainer>
		</div>
	);
}

function NameStep() {
	const { register } = useFormContext<FormSignUpData>();

	return (
		<div className='flex h-full w-full flex-col space-y-4'>
			<h2 className='font-light'>Como devemos te chamar?</h2>
			<p className='text-sm'>Digite seu nome para personalizar sua experiência.</p>

			<LabelInputContainer>
				<Label htmlFor='username'>Nome</Label>
				<TextField id='username' placeholder='Digite seu nome' register={register('username')} />
			</LabelInputContainer>
		</div>
	);
}

function PasswordStep() {
	const { register } = useFormContext<FormSignUpData>();

	return (
		<div className='flex h-full w-full flex-col space-y-4'>
			<h2 className='font-light'>Crie uma senha segura</h2>
			<p className='text-sm'>Use pelo menos 6 caracteres com letras e números.</p>

			<LabelInputContainer>
				<Label htmlFor='password'>Senha</Label>
				<TextField id='password' type='password' placeholder='••••••••' register={register('password')} />
			</LabelInputContainer>
		</div>
	);
}

function LabelInputContainer({ children, className }: { children: React.ReactNode; className?: string }) {
	return <div className={cn('flex w-full flex-col space-y-2', className)}>{children}</div>;
}
`;

const componentCode =
	`
//src/components/stepFormProvider/stepFormProvider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';

interface FormProviderProps {
	forms: ReactNode[];
	actualForm: number;
}

export default function StepFormProvider({ forms, actualForm }: FormProviderProps) {
	const [prevForm, setPrevForm] = useState(actualForm);
	const [direction, setDirection] = useState(0);
	const [transitioning, setTransitioning] = useState(false);

	useEffect(() => {
		if (actualForm === prevForm) return;

		setDirection(actualForm > prevForm ? 1 : -1);
		setTransitioning(true);

		const timer = setTimeout(() => {
			setPrevForm(actualForm);
			setTransitioning(false);
		}, 300); // deve bater com a duração das animações

		return () => clearTimeout(timer);
	}, [actualForm, prevForm]);

	return (
		<div className='relative h-full w-full overflow-hidden'>
			{/* Form que está saindo */}
			{transitioning && (
				<div
					className='absolute left-0 top-0 h-full w-full'
					style={{
					` +
	"animation: `${direction === 1 ? 'slideOutLeft' : 'slideOutRight'} 300ms ease-in-out forwards`," +
	`					}}
				>
					{forms[prevForm]}
				</div>
			)}

			{/* Form que está entrando */}
			<div
				className='absolute left-0 top-0 h-full w-full'
				style={{
					animation: transitioning` +
	"? `${direction === 1 ? 'slideInRight' : 'slideInLeft'} 300ms ease-in-out forwards`" +
	`: undefined,
				}}
			>
				{forms[transitioning ? actualForm : prevForm]}
			</div>
			` +
	'<style jsx global>{`' +
	'@keyframes slideOutLeft {' +
	`from {
						transform: translateX(0%);
						opacity: 1;
					}
					to {
						transform: translateX(-100%);
						opacity: 0;
					}
				}
				@keyframes slideOutRight {
					from {
						transform: translateX(0%);
						opacity: 1;
					}
					to {
						transform: translateX(100%);
						opacity: 0;
					}
				}
				@keyframes slideInRight {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0%);
						opacity: 1;
					}
				}
				@keyframes slideInLeft {
					from {
						transform: translateX(-100%);
						opacity: 0;
					}
					to {
						transform: translateX(0%);
						opacity: 1;
					}
				}` +
	'`}</style>' +
	`</div>
	);
}
`;
