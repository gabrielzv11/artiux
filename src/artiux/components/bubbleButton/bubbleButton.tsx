'use client';

import CircularProgress from '@/components/circularProgress/circularProgress';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Bubble {
	id: number;
	left: number;
	delay: number;
	initialRotation: number;
	rotationDuration: number;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	loading: boolean;
	bubbleIcon?: React.ReactNode;
	svgDuration?: number;
	svgDelay?: number;
}

export default function BubbleButton({ loading, svgDelay = 0.05, svgDuration = 2, children, bubbleIcon, ...props }: ButtonProps) {
	const [bubbles, setBubbles] = useState<Bubble[]>([]);
	const [isCoolingDown, setIsCoolingDown] = useState(false);

	const animateButton = () => {
		if (isCoolingDown) return;

		setIsCoolingDown(true);

		const timestamp = Date.now();
		const newBubbles: Bubble[] = Array.from({ length: 10 }).map((_, i) => ({
			id: timestamp + i,
			left: Math.random() * 100,
			delay: i * svgDelay,
			initialRotation: Math.random() * 360,
			rotationDuration: svgDuration + Math.random() * svgDuration,
		}));

		setBubbles((prev) => [...prev, ...newBubbles]);

		setTimeout(() => {
			setBubbles((prev) => prev.slice(newBubbles.length));
		}, 1200);

		setTimeout(() => {
			setIsCoolingDown(false);
		}, 300);
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		props.onClick?.(e);
		animateButton();
	};

	return (
		<button
			onClick={handleClick}
			className={cn(
				'relative flex items-center gap-1 overflow-hidden rounded border border-white px-6 py-2 font-mono tracking-wider text-white transition-all duration-100',
				'disabled:brightness-75',
				'[&:hover:not(:disabled):not(:active)]:-translate-y-0.5',
				'[&:hover:not(:disabled):not(:active)]:shadow-[4px_4px_0_0_#fff]',
				props.className
			)}
			disabled={loading || props.disabled}
		>
			{children}
			{loading && <CircularProgress size={20} color='white' />}

			{bubbles.map((bubble) => (
				<motion.div
					key={bubble.id}
					initial={{
						y: 15,
						scale: 1,
						opacity: 1,
						rotate: bubble.initialRotation,
					}}
					animate={{
						y: -150,
						scale: 1.5,
						opacity: 0,
						rotate: bubble.initialRotation + 360,
					}}
					transition={{
						duration: bubble.rotationDuration,
						ease: 'easeOut',
						delay: bubble.delay,
					}}
					style={{
						left: `${bubble.left}%`,
					}}
					className='pointer-events-none absolute bottom-0 flex items-center justify-center'
				>
					{bubbleIcon ?? <div className='h-3 w-2 rounded-full bg-white blur-[1px]' />}
				</motion.div>
			))}
		</button>
	);
}
