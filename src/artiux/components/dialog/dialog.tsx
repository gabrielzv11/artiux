'use client';

import { forwardRef, useEffect, useRef } from 'react';

import { useOutsideClick } from '@/hook/useOutsideClick';
import { cn } from '@/lib/utils';

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
	open: boolean;
	onClose: () => void;
	closeButton?: boolean;
}

export default function Dialog({ closeButton, open, onClose, children, ...props }: DialogProps) {
	const modalRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
	useOutsideClick(modalRef, () => onClose());

	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	}, [open]);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className='fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[4px] transition-all'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<Wrapper
						ref={modalRef}
						className='bg-card text-card-foreground border-border relative w-full max-w-lg rounded-lg border p-4 shadow-2xl'
					>
						{closeButton && (
							<div className='text-foreground absolute top-4 right-4 cursor-pointer rounded-full p-1 transition-colors'>
								<X size={16} onClick={onClose} />
							</div>
						)}

						{children}
					</Wrapper>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

const Title = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<h3 className='text-lg leading-none font-semibold tracking-tight'>{children}</h3>
		</>
	);
};

const Header = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div className='flex items-center pb-4'>{children}</div>
		</>
	);
};

const Body = ({ children }: { children: React.ReactNode }) => {
	return <div className='block py-2'>{children}</div>;
};

const Footer = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div className='flex items-center justify-end pt-4'>{children}</div>
		</>
	);
};

Dialog.Header = Header;
Dialog.Title = Title;
Dialog.Body = Body;
Dialog.Footer = Footer;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Wrapper = forwardRef<HTMLDivElement, ContainerProps>(({ children, ...props }, ref) => {
	return (
		<>
			<motion.div
				ref={ref}
				className={cn('', props.className)}
				initial={{ opacity: 0.3, scaleX: 0.9, scaleY: 0.2 }}
				viewport={{ once: true }}
				animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
				exit={{ opacity: 0.3, scaleX: 0.9, scaleY: 0.5 }}
				transition={{
					type: 'spring',
					bounce: 0.4,
					duration: 0.5,
				}}
			>
				{children}
			</motion.div>
		</>
	);
});
