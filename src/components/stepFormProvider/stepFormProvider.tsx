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
					className='absolute top-0 left-0 h-full w-full'
					style={{
						animation: `${direction === 1 ? 'slideOutLeft' : 'slideOutRight'} 300ms ease-in-out forwards`,
					}}
				>
					{forms[prevForm]}
				</div>
			)}

			{/* Form que está entrando */}
			<div
				className='absolute top-0 left-0 h-full w-full'
				style={{
					animation: transitioning ? `${direction === 1 ? 'slideInRight' : 'slideInLeft'} 300ms ease-in-out forwards` : undefined,
				}}
			>
				{forms[transitioning ? actualForm : prevForm]}
			</div>

			<style jsx global>{`
				@keyframes slideOutLeft {
					from {
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
				}
			`}</style>
		</div>
	);
}
