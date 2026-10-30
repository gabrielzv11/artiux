'use client';

import { motion } from 'motion/react';

export const LampLight = () => {
	return (
		<div className='absolute bottom-0 left-1/2 z-0 -translate-x-1/2'>
			{/* Cones laterais */}
			<motion.div
				initial={{ opacity: 0.5, width: '15rem' }}
				animate={{ opacity: 1, width: '30rem' }}
				transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
				style={{
					backgroundImage: `conic-gradient(from 70deg at center top, #06b6d4, transparent, transparent)`,
				}}
				className='absolute right-full bottom-0 h-56 w-[30rem] opacity-60 blur-2xl'
			/>

			<motion.div
				initial={{ opacity: 0.5, width: '15rem' }}
				animate={{ opacity: 1, width: '30rem' }}
				transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
				style={{
					backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, #06b6d4)`,
				}}
				className='absolute bottom-0 left-full h-56 w-[30rem] opacity-60 blur-2xl'
			/>

			{/* Núcleo central de luz */}
			<motion.div
				initial={{ width: '8rem' }}
				animate={{ width: '16rem' }}
				transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
				className='relative z-10 h-36 rounded-full bg-cyan-400 opacity-70 blur-2xl'
			/>

			{/* Linha brilhante */}
			<motion.div
				initial={{ width: '15rem' }}
				animate={{ width: '30rem' }}
				transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
				className='mt-2 h-0.5 bg-cyan-400 opacity-70'
			/>
		</div>
	);
};
