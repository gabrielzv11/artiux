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

	const formComponents = [<EmailStep key='email' />, <NameStep key='name' />, <PasswordStep key='password' />];

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
