'use client';

import { AnimatePresence, motion, Transition } from 'motion/react';
import { usePathname } from 'next/navigation';

import { Icon } from '@/artiux/components/icons';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';

const animationPresets = {
	bounce: {
		nav: {
			initial: { height: 0, scale: 0.9 },
			animate: { height: 'auto', scale: 1 },
			exit: { height: 0, scale: 0.9 },
			transition: { type: 'spring', bounce: 0.4, duration: 0.5 },
		},
		item: {
			initial: { x: -16, scale: 0.7 },
			animate: { x: 0, scale: 1 },
			exit: { x: -16, scale: 0.7, opacity: 0 },
			transition: { type: 'spring', bounce: 0.55, duration: 0.45 },
			exitTransition: { type: 'tween', ease: 'easeOut', duration: 0.2 },
		},
	},
	slide: {
		nav: {
			initial: { height: 0 },
			animate: { height: 'auto' },
			exit: { height: 0 },
			transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 },
		},
		item: {
			initial: { x: -24 },
			animate: { x: 0 },
			exit: { x: -24 },
			transition: { type: 'tween', ease: 'easeOut', duration: 0.28 },
			exitTransition: { type: 'tween', ease: 'easeIn', duration: 0.2 },
		},
	},
} as const;

function scaleTransition(transition: Transition, speed: number): Transition {
	const duration = (transition as { duration?: number }).duration;
	return duration ? { ...transition, duration: duration / speed } : transition;
}

function humanizeSegment(segment: string) {
	return segment
		.replace(/-/g, ' ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.trim()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export interface BreadcrumbProps {
	/** Sobrescreve o pathname real (útil para preview/testes). Se omitido, usa usePathname(). */
	pathname?: string;
	/** Quando fornecido, cliques num item não navegam de verdade e chamam isso com o href do item (útil em sandbox/preview). */
	onNavigate?: (href: string) => void;
	/** Estilo visual: 'ghost' (texto simples) ou 'contained'. */
	variant?: 'ghost' | 'contained';
	/** Estilo de animação: 'bounce' (spring com bounce) ou 'slide' (tween sóbrio, entra por trás do item anterior). */
	animation?: 'bounce' | 'slide';
	/** Multiplicador de velocidade das animações (1 = padrão, 2 = 2x mais rápido, 0.5 = metade da velocidade). */
	speed?: number;
}

export function Breadcrumb({ pathname: pathnameProp, onNavigate, variant = 'ghost', animation = 'bounce', speed = 1 }: BreadcrumbProps) {
	const realPathname = usePathname();
	const pathname = pathnameProp ?? realPathname;
	const segments = pathname.split('/').filter(Boolean);
	const visible = segments.length >= 2;
	const preset = animationPresets[animation];

	const navTransition = scaleTransition(preset.nav.transition, speed);
	const itemTransition = scaleTransition(preset.item.transition, speed);
	const itemExitTransition = scaleTransition(preset.item.exitTransition, speed);

	const items = segments.map((segment, index) => ({
		label: humanizeSegment(segment),
		href: '/' + segments.slice(0, index + 1).join('/'),
	}));

	return (
		<AnimatePresence>
			{visible && (
				<motion.nav
					key='breadcrumb'
					initial={preset.nav.initial}
					animate={preset.nav.animate}
					exit={preset.nav.exit}
					transition={navTransition}
					className={cn('text-muted-foreground mt-20 flex items-center overflow-hidden text-sm')}
					aria-label='Breadcrumb'
				>
					<AnimatePresence initial={false} mode='popLayout'>
						{items.map((item, index) => {
							const isLast = index === items.length - 1;

							return (
								<motion.span
									key={item.href}
									layout
									className='relative flex items-center gap-2'
									style={animation === 'slide' ? { zIndex: items.length - index } : undefined}
								>
									{/* Camada isolada da animação de entrada/saída — não conflita com o reflow do layout */}
									<motion.span
										initial={preset.item.initial}
										animate={preset.item.animate}
										exit={{ ...preset.item.exit, transition: itemExitTransition }}
										transition={itemTransition}
										className='flex items-center gap-2'
									>
										{/* Separador */}
										{index > 0 && <Icon icon='chevron-right' className='size-3.5' />}

										{isLast ? (
											<span
												className={cn(
													'text-foreground font-medium',
													variant === 'contained' && 'bg-primary/10 text-primary rounded-md px-3 py-1'
												)}
											>
												{item.label}
											</span>
										) : onNavigate ? (
											<button
												type='button'
												onClick={() => onNavigate(item.href)}
												className={cn(
													'appearance-none border-0 bg-transparent p-0 tracking-wider outline-none',
													'hover:text-foreground cursor-pointer transition-colors',
													variant === 'contained' && 'bg-primary/5 text-primary hover:bg-primary/10 rounded-md px-3 py-1'
												)}
											>
												{item.label}
											</button>
										) : (
											<Link
												href={item.href}
												variant='ghost'
												className={cn(
													'hover:text-foreground',
													variant === 'contained' && 'bg-primary/5 text-primary hover:bg-primary/10 rounded-md px-3 py-1'
												)}
											>
												{item.label}
											</Link>
										)}
									</motion.span>
								</motion.span>
							);
						})}
					</AnimatePresence>
				</motion.nav>
			)}
		</AnimatePresence>
	);
}
