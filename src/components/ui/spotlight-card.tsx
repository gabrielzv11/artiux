import { cn } from '@/lib/utils';

import next from '@/assets/images/next.png';
import tailwindcss from '@/assets/images/tailwindcss.png';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface Position {
	x: number;
	y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
	className?: string;
	spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
	const divRef = useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
	const [opacity, setOpacity] = useState<number>(0);

	const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!divRef.current || isFocused) return;

		const rect = divRef.current.getBoundingClientRect();
		setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	};

	const handleFocus = () => {
		setIsFocused(true);
		setOpacity(0.6);
	};

	const handleBlur = () => {
		setIsFocused(false);
		setOpacity(0);
	};

	const handleMouseEnter = () => {
		setOpacity(0.6);
	};

	const handleMouseLeave = () => {
		setOpacity(0);
	};

	return (
		<div
			ref={divRef}
			onMouseMove={handleMouseMove}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={cn(`relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-8`, className)}
		>
			<div
				className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out'
				style={{
					opacity,
					background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
				}}
			/>
			{children}
		</div>
	);
};

export default SpotlightCard;

export const CardsGroup = () => {
	<div className='grid grid-cols-3 gap-4 pb-4'>
		<SpotlightCard className='space-y-4 rounded-l-[48px] rounded-r-none bg-violet-900/20'>
			<h1 className='font-sans text-3xl font-normal tracking-wide'>TS</h1>
			<p className='text-sm'>Desenvolvido com pensando em Typescript</p>
		</SpotlightCard>
		<SpotlightCard className='space-y-4 rounded-none bg-violet-900/20'>
			<h1 className='text-2xl font-bold'>
				<Image src={next} alt='logo' width={60} className='space-y-4 invert' />
			</h1>
			<p className='text-sm'>
				Componentes feitos pensando nas versões mais recentes do Next.js, mas que também funcionam em projetos React
			</p>
		</SpotlightCard>
		<SpotlightCard className='space-y-4 rounded-l-none rounded-r-[48px] bg-violet-900/20'>
			<h1 className='text-2xl font-bold'>
				<Image src={tailwindcss} alt='logo' width={50} />
			</h1>
			<p className='text-sm'>Estilização baseada em Tailwindcss</p>
		</SpotlightCard>
	</div>;
};
